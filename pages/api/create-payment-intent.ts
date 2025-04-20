import { StripePrice } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

interface StripePriceQuantityStub {
    price: StripePrice,
    quantity: number
}

const reduceStripeCheckoutItem = (item : {
    price: StripePrice,
    quantity: number,
    size: string
}) => {

    return {
        product_id: item.price.product,
        price_id: item.price.id,
        unit_amount: item.price.unit_amount,
        quantity: item.quantity,
        size: item.size
    }
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


        const SHIPPING_FEE = 895;
        const subtotal = calculateOrderAmount(items);
        const totalDue = subtotal >= 30000 ? subtotal : subtotal + SHIPPING_FEE

        console.log(items);

        const metadata: Record<string, string> = {};
        items.forEach((item: any, index: number) => {
            metadata[`item_${index}`] = JSON.stringify(reduceStripeCheckoutItem(item));
          });
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalDue,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
            metadata
        });

        console.log(paymentIntent);

        return res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            subtotal,
            totalDue
        })
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Something went wrong." })
    }

};