import { StripePrice } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

interface StripePriceQuantityStub {
    price: StripePrice,
    quantity: number
}

const calculateOrderAmount = (items: StripePriceQuantityStub[]) => {

    let amount = 0;
    for (let i = 0; i < items.length; i++) {
        amount +=( items[i].price.unit_amount || 0) * items[i].quantity;
    }
    return amount;
};

export default async function handleRequest(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {

    try {
        const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

        if (req.method === 'GET') {

            const paymentIntentId = String(req.query.payment_intent);

            const result = await stripe.paymentIntents.retrieve(paymentIntentId);

            if (!result.latest_charge) {
                throw Error("No latest charge exists.")
            }

            const charge = await stripe.charges.retrieve(String(result.latest_charge));
            console.log(charge);
            return res.status(200).json({ message: "Success", receipt_url: charge.receipt_url });
        }

        if (req.method != 'POST') {
            return res.status(405).end('Method Not Allowed');
        }
        const { items } = req.body;


        const subtotal = calculateOrderAmount(items);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: subtotal,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log(paymentIntent);

        return res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            subtotal: subtotal
        })
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Something went wrong." })
    }

};