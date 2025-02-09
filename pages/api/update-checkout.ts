import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

/**
 * Private preview
 */

export default async function handleRequest(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method != 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }

    const line_items = req.body.line_items;
    const checkout_session_id = req.body.checkout_session_id;


    try {
        if (!line_items) {
            throw Error("No line items.")
        }
        const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));
        const session = await stripe.checkout.sessions.retrieve(
            checkout_session_id,
            {
                expand: ['line_items']
            }
        );


        const newLineItems = session.line_items?.data || [];

        throw Error("Private preview")

        // await stripe.checkout.sessions.update(checkout_session_id, {
        //     line_items: newLineItems
        // })
        res.status(200).json({ message: "Success"})
    } catch (err) {
        console.log(err);
        res.status(500).json("Something went wrong.");
    }
}