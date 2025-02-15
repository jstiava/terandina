import { StripeProduct } from "@/types";
import Mongo from "@/utils/mongo";
import { WithId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { unique } from "next/dist/build/utils";
import Stripe from "stripe";


/**
 * product.created
 * product.deleted
 * product.updated
 * @param req 
 * @param res 
 * @returns 
 */


export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  let event: Stripe.Event;

  try {
    
    const sig = req.headers["stripe-signature"] as string;
    const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

  } catch (err: any) {

    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }


  try {

    const mongo = await Mongo.getInstance();
    if (event.type === "product.created") {
      const product = event.data.object as Stripe.Product;
      console.log("Updating product:", product);

      await mongo.clientPromise.db('products').collection('products').insertOne(product);


      return res.status(200).json({ message: "Successfully added." })
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

      return res.status(200).json({ message: "Successfully updated." })

      // TODO: Remove the product from your database
    }

    if (event.type === "price.created") {
      const price = event.data.object as Stripe.Price;

      const theProduct = await mongo.clientPromise.db('products').collection('products').findOne({
        id: price.product
      }) as WithId<StripeProduct> | null

      if (!theProduct) {
        return res.status(500).json({ message: "No product found." })
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

      return res.status(200).json({ message: "Successfully updated." })
    }


    if (event.type === "price.updated") {
      const price = event.data.object as Stripe.Price;

      const theProduct = await mongo.clientPromise.db('products').collection('products').findOne({
        id: price.product
      }) as WithId<StripeProduct> | null

      if (!theProduct) {
        return res.status(500).json({ message: "No product found." })
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
        return res.status(201).json({ message: "Price was added to list." })
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

      return res.status(200).json({ message: "Successfully updated." })
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Database update failed:", error);
    res.status(500).send("Server error");
  }
}