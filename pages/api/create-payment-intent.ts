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

        return res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            subtotal: subtotal
        })
    }
    catch (err) {
        return res.status(400).json({ message: "Something went wrong." })
    }

};



/**
 * 
 * {
  id: 'pi_3Qmz4iJrcLUH8C2z0Mm93cxy',
  object: 'payment_intent',
  amount: 18000,
  amount_capturable: 0,
  amount_details: { tip: {} },
  amount_received: 18000,
  application: null,
  application_fee_amount: null,
  automatic_payment_methods: { allow_redirects: 'always', enabled: true },
  canceled_at: null,
  cancellation_reason: null,
  capture_method: 'automatic_async',
  client_secret: 'pi_3Qmz4iJrcLUH8C2z0Mm93cxy_secret_AjtDrXUGJkX4k4h8ztNRp13TP',
  confirmation_method: 'automatic',
  created: 1738248636,
  currency: 'usd',
  customer: null,
  description: null,
  invoice: null,
  last_payment_error: null,
  latest_charge: 'ch_3Qmz4iJrcLUH8C2z0xL6AgOt',    
  livemode: false,
  metadata: {},
  next_action: null,
  on_behalf_of: null,
  payment_method: 'pm_1Qmz53JrcLUH8C2zg7ZA2WB2',   
  payment_method_configuration_details: { id: 'pmc_1QmLTSJrcLUH8C2zEXN8i3RN', parent: null },
  payment_method_options: {
    affirm: {},
    amazon_pay: { express_checkout_element_session_id: null },
    card: {
      installments: null,
      mandate_options: null,
      network: null,
      request_three_d_secure: 'automatic'
    },
    cashapp: {},
    klarna: { preferred_locale: null },
    link: { persistent_token: null }
  },
  payment_method_types: [ 'card', 'klarna', 'link',
 'affirm', 'cashapp', 'amazon_pay' ],
  processing: null,
  receipt_email: null,
  review: null,
  setup_future_usage: null,
  shipping: null,
  source: null,
  statement_descriptor: null,
  statement_descriptor_suffix: null,
  status: 'succeeded',
  transfer_data: null,
  transfer_group: null
}

 */