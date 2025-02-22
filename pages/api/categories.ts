import SafeString from "@/middleware/security";
import verifySession from "@/middleware/session/verifySession";
import { StripePrice, StripeProduct } from "@/types";
import Mongo from "@/utils/mongo";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const sizeOrder = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

function formatString(input: string) {
  return input
    .toLowerCase()               // Convert to lowercase
    .replace(/[^a-z\s]/g, '')    // Remove non-alphabetic characters
    .replace(/\s+/g, '_');       // Replace spaces with underscores
}

async function handlePostRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {

  const userAuth = verifySession(req);
  if (!userAuth) return res.status(401).json({ message: 'Usage' });

  try {
    const mongo = await Mongo.getInstance();

    const data = req.body;

    if (!data.name || !data.type || !data.products) {
      return res.status(500).json({ message: "No product." })
    }

    const newFile = {
      name: data.name,
      type: data.type,
      slug: formatString(data.name),
      parent_id: null,
      is_on_menu: null
    }

    const newCategory = await mongo.clientPromise.db('products').collection('categories').insertOne(newFile)

    if (data.products) {

      console.log(data.products)

      const update = await mongo.clientPromise
        .db('products')
        .collection('products')
        .updateMany(
          { id: { $in: data.products } },
          {
            $addToSet: { categories: newCategory.insertedId }
          }
        );

      console.log(update);
    }


    return res.status(200).json({
      message: "Success",
      category: {
        ...newFile,
        _id: newCategory.insertedId,
      }
    })

  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong.");
  }
}


async function deleteProductById(productId: string): Promise<boolean> {
  return false;
}

async function getProductById(productId: string): Promise<any | null> {
  try {
    const mongo = await Mongo.getInstance();

    const [product] = await mongo.clientPromise.db('products').collection('products').find({
      id: productId
    }).toArray()

    return product
  } catch (error) {
    console.error("Error retrieving product:", error);
    return null;
  }
}

async function getAllCategories() {
  try {
    const mongo = await Mongo.getInstance();

    const categories = await mongo.clientPromise.db('products').collection('categories').find().toArray()

    return categories;
  } catch (error) {
    console.error('Error retrieving categories:', error);
  }
}


async function handleDeleteRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {

  const products = req.body.products as string[];

  try {

    if (!products) {
      throw Error("No products provided")
    }
    const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

    for (const product_id of products) {
      const result = await stripe.products.update(product_id, {
        active: false
      })
      console.log(result);
    }

    return res.status(200).json({
      message: "Updated products"
    })
  }
  catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Failure" })
  }
}


const sendToStripeFields: (keyof Stripe.Product)[] = ['name', 'description']
const allowedFields: (keyof StripeProduct)[] = ['images', 'name', 'description'];

async function handleUpdateProduct(product_id: string, data: Partial<StripeProduct>) {
  try {
    const mongo = await Mongo.getInstance();
    const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

    const sendToStripeFirst: Record<string, any> = {};
    const updateData: Record<string, any> = {};

    for (const key of sendToStripeFields) {
      if (key in data) {
        sendToStripeFirst[key] = data[key];
      }
    }

    for (const key of allowedFields) {
      if (key in data) {
          updateData[key] = data[key]!;
      }
    }

    if (Object.keys(updateData).length != 0) {
      await mongo.clientPromise.db('products').collection('products').updateOne({
        id: product_id
      }, {
        $set: updateData
      })
    }

    if (Object.keys(sendToStripeFirst).length != 0) {
      await stripe.products.update(product_id, sendToStripeFirst)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err);
        })
    }

    return true;

  } catch (error) {
    console.error('Error updating product:', error);
  }
  return false;
}

async function handlePatchRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {

  const userAuth = verifySession(req);
  if (!userAuth) return res.status(401).json({ message: 'Usage' });

  const product_id = req.query.id;
  const data = req.body;

  try {
    const product = await handleUpdateProduct(String(product_id), data)
    if (!product) {
      throw Error("No product found by that id.")
    }
    return res.status(200).json({
      message: "Success. Updated product.",
    })
  }
  catch (err) {
    return res.status(400).json({ message: "Failure" })
  }

  return res.status(400).json({ message: "Not implemented" })
}



export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {

  if (req.method === 'POST') {
    return handlePostRequest(req, res);
  }

  if (req.method === 'DELETE') {
    // return handleDeleteRequest(req, res);
  }

  if (req.method === 'PATCH') {
    // return handlePatchRequest(req, res);
  }

  if (req.method != 'GET') {
    res.status(405).end('Method Not Allowed');
  }

  const product_id = req.query.id;
  const doNotCache = new SafeString(req.query.doNotCache);

  //   if (product_id) {
  //     const product = await getProductById(String(product_id))
  //     if (!product) {
  //       throw Error("No product found by that id.")
  //     }
  //     return res.status(200).json({
  //       message: "Success. Got one product.",
  //       product
  //     })
  //   }

  try {
    const categories = await getAllCategories();

    if (!categories) {
      throw Error("No categories.")
    }

    if (doNotCache.isTrue()) {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    }

    res.status(200).json({
      message: "Success",
      categories
    })
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong.");
  }
}