import Mongo from "@/utils/mongo";
import { NextApiRequest, NextApiResponse } from "next";
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
        if (event.type === "product.created" || event.type === "product.updated") {
          const product = event.data.object as Stripe.Product;
          console.log("Updating product:", product);

          await mongo.clientPromise.db('products').collection('products').insertOne(product);


          return res.status(200).json({ message: "Successfully added."})
        }
    
        if (event.type === "product.deleted") {
          const product = event.data.object as Stripe.Product;
          console.log("Deleting product:", product.id);
    
          // TODO: Remove the product from your database
        }
    
        res.status(200).send("Webhook received");
      } catch (error) {
        console.error("Database update failed:", error);
        res.status(500).send("Server error");
      }
}