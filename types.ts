import Stripe from "stripe";
import { UseCart } from "./checkout/useCart";


export interface StripeAppProps {
    Cart: UseCart
}

export interface StripePrice extends Stripe.Price {
    product: string;
    unit_amount: number;
    currency: string;
}
export interface StripeProduct extends Stripe.Product {
    id: string,
    name: string,
    metadata: any,
    default_price: string,
    description: string,
    images: string[],
    prices: StripePrice[],

    // checkout
    selectedPrice: StripePrice,
    quantity: number,
}