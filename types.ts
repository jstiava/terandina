import Stripe from "stripe";
import { UseCart } from "./checkout/useCart";


export interface StripeAppProps {
    Cart: UseCart
}

export interface StripePrice extends Stripe.Price {
    product: string;
    unit_amount: number | null;
    currency: string;
    inventory?: number;
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

export interface VariantProductStub {
    url: string,
    pattern: "image" | "duo" | "single" | "diamond",
    product_id: string
}

export interface Category {
    _id: string, 
    name: string,
    slug: string,
    parent_id: string,
    is_on_menu: boolean,

}