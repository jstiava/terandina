import { StripePrice, StripeProduct } from "@/types";
import Mongo from "@/utils/mongo";
import { WithId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { unique } from "next/dist/build/utils";
import Stripe from "stripe";
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false
  },
}

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  let event: Stripe.Event;

  try {

    const sig = req.headers["stripe-signature"] as string;
    const buf = await buffer(req);
    const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    event = stripe.webhooks.constructEvent(
      buf.toString(),
      sig,
      endpointSecret
    );
    res.status(200).json({ message: "Thank you, Stripe" })
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {

    const mongo = await Mongo.getInstance();

    console.log(event.type);
    if (event.type === "product.created") {
      console.log("Create Product")
      const product = event.data.object as Stripe.Product;

      const prices = await mongo.clientPromise.db('products').collection('prices_temp').find({
        product: product.id
      }).toArray() as WithId<StripePrice>[];

      await mongo.clientPromise.db('products').collection('products').insertOne({
        ...product,
        prices,
        selectedPrice: null,
        quantity: 1
      });

      await mongo.clientPromise.db('products').collection('products').deleteMany({
        _id: { $in: prices.map(p => p._id) }
      })

      return;
    }

    if (event.type === 'product.deleted') {
      const product = event.data.object as Stripe.Product;
      await mongo.clientPromise.db('products').collection('products').deleteOne({
        id: product.id
      })
      return;
    }

    if (event.type === "product.updated") {
      const product = event.data.object as Stripe.Product;
      const result = await mongo.clientPromise.db('products').collection('products').updateOne({
        id: product.id
      }, {
        $set: {
          name: product.name,
          description: product.description
        }
      })

      console.log(result);
      return;
    }

    if (event.type === "price.created") {
      console.log("Create price")
      const price = event.data.object as Stripe.Price;
      return await handlePriceCreatedEvent(price);
    }

    if (event.type === "price.deleted" || event.type === 'price.updated') {
      console.log("Delete/Update Product")
      const price = event.data.object as Stripe.Price;

      console.log(price);
      const theProduct = await mongo.clientPromise.db('products').collection('products').findOne({
        id: price.product
      }) as WithId<StripeProduct> | null;

      if (!theProduct) {
        console.error("No product found.")
        return await handlePriceCreatedEvent(price)
      }

      const newPrices = theProduct.prices.filter(x => x.id != price.id);

      if (event.type === 'price.updated') {
        newPrices.push({
          ...price,
          product: theProduct.id
        });
      }

      console.log(newPrices)

      const result = await mongo.clientPromise.db('products').collection('products').updateOne({
        id: theProduct.id
      }, {
        $set: {
          prices: newPrices
        }
      })

      console.log({
        result,
        oldProduct: theProduct
      });

      return;
    }

    return;

  } catch (error) {
    console.error(error);
    console.log("Error")
  }

}


const handlePriceCreatedEvent = async (price: Stripe.Price) => {

  console.log("Create new price")
  const mongo = await Mongo.getInstance();
  const theProduct = await mongo.clientPromise.db('products').collection('products').findOne({
    id: price.product
  }) as WithId<StripeProduct> | null

  if (!theProduct) {
    console.log("No product")
    await mongo.clientPromise.db('products').collection('prices_temp').insertOne({
      ...price,
      product: price.product as string
    })
    return;
  }

  let newPrices = theProduct.prices;
  newPrices.push({
    ...price,
    product: price.product as string
  });

  
  const result = await mongo.clientPromise.db('products').collection('products').updateOne({
    id: theProduct.id
  }, {
    $set: {
      prices: newPrices
    }
  });

  console.log({
    product: theProduct,
    result
  })
}