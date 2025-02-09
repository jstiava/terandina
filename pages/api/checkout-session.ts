import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

/**
 * https://docs.stripe.com/checkout/quickstart?client=next
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
    
    
    try {
        if (!line_items) {
            throw Error("No line items.")
        }
        const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${req.headers.origin}/?success=true`,
            cancel_url: `${req.headers.origin}/?canceled=true`,
        });
        res.redirect(303, String(session.url));
    } catch (err) {
        console.log(err);
        res.status(500).json("Something went wrong.");
    }
}