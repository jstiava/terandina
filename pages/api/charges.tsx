import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { getProductById } from "./products";


export default async function handleRequest(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {

    if (req.method != 'GET') {
        res.status(405).end('Method Not Allowed');
        return;
    }

    try {

        const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

        const charges = await stripe.charges.list({
            limit: 100
        });

        const list = charges.data as (Stripe.Charge & { products?: any })[];

        const theCharges = [];

        for (const charge of list) {
            charge.products = [];
            const products = JSON.parse(JSON.stringify(charge.metadata)) as Record<string, string>;

            for (const [key, value] of Object.entries(products)) {

                const parsed = JSON.parse(value);
                const product = await getProductById(parsed.product_id);
                if (!product) {
                    continue;
                }

                product.selectedPrice = product.prices.find((x) => x.id === parsed.price_id);
                product.quantity = parsed.quantity;
                product.size = parsed.size;
                charge.products.push(product);
            }
            theCharges.push(charge);
        }

        return res.status(200).json({
            charges: theCharges
        })

    }
    catch (err) {
        console.log(err);
        res.status(500).json("Something went wrong.");
    }

}