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

export interface SizeChart {
    XXS?: boolean,
    XS?: boolean,
    S?: boolean,
    M?: boolean,
    L?: boolean,
    XL?: boolean,
    XXL?: boolean,
    '8'?: boolean,
    '9'?: boolean,
    '10'?: boolean,
    '11'?: boolean,
    '12'?: boolean,
    '13'?: boolean,
}

export const SIZING_OPTIONS = (['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '8', '9', '10', '11', '12', '13'] as (keyof SizeChart)[]);


export interface TerandinaImage {
    small: string | null,
    medium: string | null,
    large: string | null
}
export interface StripeProduct extends Stripe.Product {
    id: string,
    name: string,
    metadata: any,
    media: TerandinaImage[],
    prices: StripePrice[],
    is_featured: boolean,
    categories: string[] | Category[], // category_ids
    related: string[], // product_ids
    details?: string,
    sizes?: SizeChart,
    default_size?: string,
    
    // checkout
    size?: string,
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
    type: 'variant' | 'collection' | 'tag',
    products: StripeProduct[],
    media: TerandinaImage[],
    categories: string[] | Category[],
    description?: string | null

}