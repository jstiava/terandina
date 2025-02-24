import Stripe from "stripe";
import { UseCart } from "./checkout/useCart";


export interface StripeAppProps {
    Cart: UseCart,
    categories: Category[] | null
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
    images: string[],
    prices: StripePrice[],
    is_featured: boolean,
    categories: string[], // category_ids
    related: string[], // product_ids

    // checkout
    selectedPrice: StripePrice | null,
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
    type: 'variant' | 'collection',
    products: StripeProduct[]

}