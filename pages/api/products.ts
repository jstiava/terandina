import SafeString from "@/middleware/security";
import verifySession from "@/middleware/session/verifySession";
import { StripePrice, StripeProduct } from "@/types";
import Mongo from "@/utils/mongo";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const sizeOrder = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
const sendToStripeFields: (keyof Stripe.Product)[] = ['name', 'description']
const allowedFields: (keyof StripeProduct)[] = ['images', 'name', 'description', 'is_featured', 'categories'];

async function handlePostRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {

  const userAuth = verifySession(req);
  if (!userAuth) return res.status(401).json({ message: 'Usage' });

  try {
    const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));
    const newProduct: StripeProduct = req.body.product;
    const newPrices: StripePrice[] = newProduct.prices;

    if (!newProduct) {
      return res.status(500).json({ message: "No product." })
    }

    const sendToStripeFirst : any = {};

    for (const key of sendToStripeFields) {
      if (key in newProduct) {
        if (typeof newProduct[key] === 'string' && newProduct[key] === '') {
          continue;
        }
        sendToStripeFirst[key] = newProduct[key];
      }
    }

    if (!sendToStripeFirst.name) {
      throw Error("Need to provide a name");
    }

    const theProduct = await stripe.products.create(sendToStripeFirst);

    console.log(theProduct);
    if (!theProduct) {
      throw Error("The new product was not returned.")
    }

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
    
    const foundProduct = await stripe.products.retrieve(theProduct.id);
    const foundPrices = await stripe.prices.list({
      product: theProduct.id
    })

    return res.status(200).json({
      message: "Success",
      product: {
        ...foundProduct,
        prices: foundPrices
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

export async function getProductById(productId: string): Promise<any | null> {
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

export async function getAllProducts(query : Partial<{
  [key: string]: string | string[];
}>) {
  try {

    const mongo = await Mongo.getInstance();

    const filter : Partial<{
      [key in keyof StripeProduct]: any
    }> = {};

    if (query.is_featured != undefined) {
      filter.is_featured = new SafeString(query.is_featured).isTrue();
    }
    if (query.category != undefined) {
      const cat_id = new ObjectId(new SafeString(query.category).toString());
      filter.categories = cat_id;
    }

    const products = await mongo.clientPromise.db('products').collection('products').find(filter).toArray()

    return products;
  } catch (error) {
    console.error('Error retrieving products:', error);
  }
}


async function handleDeleteRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {

  const userAuth = verifySession(req);
  if (!userAuth) return res.status(401).json({ message: 'Usage' });

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




export async function handleUpdateProduct(product_id: string, data: Partial<StripeProduct>) {
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
        if (key === 'categories') {
          const ids = data[key]?.map(id => {
            return new ObjectId(id);
          })
          updateData[key] = ids;
        }
        else {
          updateData[key] = data[key]!;
        }
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
        return false;
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
    const products = await getAllProducts(req.query);

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