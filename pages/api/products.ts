import SafeString from "@/middleware/security";
import verifySession from "@/middleware/session/verifySession";
import { StripePrice, StripeProduct } from "@/types";
import Mongo from "@/utils/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const sizeOrder = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];

async function handlePostRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {


  try {
    const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));
    const newProduct: StripeProduct = req.body.product;
    const newPrices: StripePrice[] = newProduct.prices;

    if (!newProduct) {
      return res.status(500).json({ message: "No product." })
    }

    const theProduct = await stripe.products.create({
      name: newProduct.name,
      description: newProduct.description,
      images: newProduct.images
    })

    if (newPrices) {
      const pricesSorted = newPrices.sort((a, b) => {
        if (!a.nickname && !b.nickname) {
          return 0;
        }
        if (!a.nickname) {
          return -1;
        }
        if (!b.nickname) {
          return 1;
        }
        return sizeOrder.indexOf(a.nickname) - sizeOrder.indexOf(b.nickname);
      })

      const addNewPrices = pricesSorted.map(price => {
        return stripe.prices.create({
          product: theProduct.id,
          unit_amount: price.unit_amount || 0,
          currency: 'USD'
        });
      });

      Promise.all(addNewPrices);
    }

    return res.status(200).json({
      message: "Success",
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

async function getAllProducts() {
  try {
    const mongo = await Mongo.getInstance();

    const products = await mongo.clientPromise.db('products').collection('products').find().toArray()

    return products;
  } catch (error) {
    console.error('Error retrieving products:', error);
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
      await stripe.products.update(product_id, {
        active: false
      })
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


const allowedFields : (keyof StripeProduct)[] = ['images'];

async function handleUpdateProduct(product_id : string, data: Partial<StripeProduct>) {
  try {
    const mongo = await Mongo.getInstance();

    const updateData: Record<string, any> = {};

    for (const key of allowedFields) {
      if (key in data) {
        updateData[key] = data[key]!;
      }
    }

    if (Object.keys(updateData).length === 0) {
      console.log('No valid fields to update.');
      return;
    }

    const products = await mongo.clientPromise.db('products').collection('products').updateOne({
      id: product_id
    }, {
      $set: updateData
    })

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
    return handleDeleteRequest(req, res);
  }

  if (req.method === 'PATCH') {
    return handlePatchRequest(req, res);
  }

  if (req.method != 'GET') {
    res.status(405).end('Method Not Allowed');
  }

  const product_id = req.query.id;
  const doNotCache = new SafeString(req.query.doNotCache);

  if (product_id) {
    const product = await getProductById(String(product_id))
    if (!product) {
      throw Error("No product found by that id.")
    }
    return res.status(200).json({
      message: "Success. Got one product.",
      product
    })
  }

  try {
    const products = await getAllProducts();

    if (!products) {
      throw Error("No products.")
    }

    if (doNotCache.isTrue()) {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    }

    res.status(200).json({
      message: "Success",
      products
    })
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong.");
  }
}