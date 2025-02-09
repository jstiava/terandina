import { StripePrice, StripeProduct } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";



async function getProductById(productId: string) : Promise<any | null> {
  try {
    const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));
    const product = await stripe.products.retrieve(productId);

    const prices = await stripe.prices.list({
      product: productId,
    });

    return {
      ...product,
      prices: prices.data
    };
  } catch (error) {
    console.error("Error retrieving product:", error);
    return null;
  }
}

async function getAllProducts() {
  try {
    const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));
    const products = await stripe.products.list({
        limit: 10,
        active: true
      });

    const prices = await stripe.prices.list({
      active: true
    })

    const productsWithPrices = products.data.map(product => {
      return {
        ...product,
        prices: prices.data.filter(price => price.product === product.id)
      }
    })

    return productsWithPrices;
  } catch (error) {
    console.error('Error retrieving products:', error);
  }
}


export default async function handleRequest(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    if (req.method != 'GET') {
        res.status(405).end('Method Not Allowed');
    }

    const product_id = req.query.id;

    if (product_id) {
      const product = await getProductById(String(product_id))
      if (!product) {
        throw Error("No product found by that id.")
      }
      return res.status(200).json({
        message: "Success. Got one product.",
        product
      })
    }

    try {
       const products = await getAllProducts();

       if (!products) {
        throw Error("No products.")
       }
        res.status(200).json({ 
            message: "Success",
            products
        })
    } catch (err) {
        console.log(err);
        res.status(500).json("Something went wrong.");
    }
}