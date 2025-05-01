import { StripePrice } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

interface StripePriceQuantityStub {
    price: StripePrice,
    quantity: number
}

const reduceStripeCheckoutItem = (item: {
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

const calculateOrderAmount = (target: StripePriceQuantityStub | StripePriceQuantityStub[]) => {

    if (Array.isArray(target)) {
        let amount = 0;
        for (let i = 0; i < target.length; i++) {
            amount += calculateOrderAmount(target[i]);
        }
        return amount;
    }

    return (target.price.unit_amount || 0) * target.quantity;
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

        const { items } = req.body;
        const SHIPPING_FEE = 895;
        const subtotal = calculateOrderAmount(items);
        const totalDue = subtotal >= 20000 ? subtotal : subtotal + SHIPPING_FEE;

        if (req.method === 'PATCH') {

            const { customer_details, paymentIntentId } = req.body;

            try {
                const oldIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

                if (!oldIntent) {
                    throw Error("No old intent")
                }

                const taxCalculation = await stripe.tax.calculations.create({
                    currency: 'usd',
                    line_items: [...items.map((item: any) => ({
                        amount: calculateOrderAmount(item),
                        reference: item.id,
                        tax_behavior: 'exclusive',
                    })), {
                        amount: SHIPPING_FEE,
                        reference: 'shipping_fee',
                        tax_behavior: 'exclusive',
                        tax_code: 'txcd_99999999'
                    }],
                    customer_details: {
                        address: customer_details.address,
                        address_source: 'shipping'
                    },
                });

                console.log(taxCalculation);

                const taxAmount = taxCalculation.tax_amount_exclusive;
                const total = totalDue + taxAmount;

                const updatedIntent = await stripe.paymentIntents.update(paymentIntentId, {
                    amount: total,
                });

                return res.status(200).json({
                    tax: taxAmount,
                    totalDue: total
                });

            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update PaymentIntent with tax.' });
            }
        }


        if (req.method != 'POST') {
            return res.status(405).end('Method Not Allowed');
        }

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

        return res.status(200).json({
            paymentIntentId: paymentIntent.id,
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