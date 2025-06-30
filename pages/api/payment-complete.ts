import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { getProductById } from "./products";


export default async function handleRequest(
    req: NextApiRequest,
    res: NextApiResponse<any>,
): Promise<void> {

    if (req.method !== 'GET') return res.status(400).json({ message: 'Method Not Allowed' });

    try {
        const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));
        const paymentIntentId = String(req.query.payment_intent);
        const result = await stripe.paymentIntents.retrieve(paymentIntentId);


        if (!result.latest_charge || typeof result.latest_charge != 'string') {
            return res.status(400).json({ message: "Something went wrong." })
        }

        const theCharge = await stripe.charges.retrieve(result.latest_charge);

        const products = JSON.parse(JSON.stringify(theCharge.metadata)) as Record<string, string>;

        (theCharge as any).products = []
        for (const [key, value] of Object.entries(products)) {

            const parsed = JSON.parse(value);
            const product = await getProductById(parsed.product_id);
            if (!product) {
                continue;
            }

            product.selectedPrice = product.prices.find((x: any) => x.id === parsed.price_id);
            product.quantity = parsed.quantity;
            product.size = parsed.size;
            (theCharge as any).products.push(product);
        }

        return res.status(200).json({ message: "Success", charge: theCharge });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Something went wrong." })
    }


}