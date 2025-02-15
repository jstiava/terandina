import { StripeProduct } from "@/types";
import Mongo from "@/utils/mongo";
import { WithId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { unique } from "next/dist/build/utils";
import Stripe from "stripe";
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false, // 🔥 Disable automatic JSON parsing
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

    // 🔥 Verify webhook signature
    const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    event = stripe.webhooks.constructEvent(
      buf.toString(),
      sig,
      endpointSecret
    );

    res.status(200).json({ message: "Thank you, Stripe"})

  } catch (err: any) {

    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }


  try {

    const mongo = await Mongo.getInstance();
    if (event.type === "product.created") {
      const product = event.data.object as Stripe.Product;
      console.log("Updating product:", product);

      await mongo.clientPromise.db('products').collection('products').insertOne({
        ...product,
        prices: [],
        selectedPrice: null,
        quantity: 1
      });


      return;
    }

    if (event.type === "product.updated") {
      const product = event.data.object as Stripe.Product;
      console.log("Deleting product:", product.id);

      await mongo.clientPromise.db('products').collection('products').updateOne({
        id: product.id
      }, {
        $set: {
          name: product.name,
          description: product.description
        }
      })

      return;

      // TODO: Remove the product from your database
    }

    if (event.type === "price.created") {
      const price = event.data.object as Stripe.Price;

      const theProduct = await mongo.clientPromise.db('products').collection('products').findOne({
        id: price.product
      }) as WithId<StripeProduct> | null

      if (!theProduct) {
        return;
      }

      let newPrices = theProduct.prices;
      if (!newPrices) {
        newPrices = [{
          ...price,
          product: price.product as string,
          unit_amount: 1
        }]
      }
      else {
        newPrices.push({
          ...price,
          product: price.product as string,
          unit_amount: 1
        });
      }

      await mongo.clientPromise.db('products').collection('products').updateOne({
        id: theProduct.id
      }, {
        prices: newPrices
      })

      return;
    }


    if (event.type === "price.updated") {
      const price = event.data.object as Stripe.Price;

      const theProduct = await mongo.clientPromise.db('products').collection('products').findOne({
        id: price.product
      }) as WithId<StripeProduct> | null

      if (!theProduct) {
        return;
      }

      const thePrice = theProduct?.prices.find(p => p.id === price.id);

      if (!thePrice) {
        await mongo.clientPromise.db('products').collection('products').updateOne({
          id: theProduct.id
        }, {
          prices: [...theProduct.prices, {
            ...price,
            product: theProduct.id,
            unit_amount: 1
          }]
        })
        return;
      }

      const newPrices = theProduct.prices.filter(x => x.id != price.id);
      newPrices.push({
        ...price,
        product: theProduct.id,
        unit_amount: 1
      });

      await mongo.clientPromise.db('products').collection('products').updateOne({
        id: theProduct.id
      }, {
        prices: newPrices
      })

      return;
    }

    return;
  } catch (error) {
    console.error("Database update failed:", error);
    console.log("Error")
  }
}