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
    XXS?: boolean | number,
    XS?: boolean | number,
    S?: boolean | number,
    M?: boolean | number,
    L?: boolean | number,
    XL?: boolean | number,
    XXL?: boolean | number,
    '8'?: boolean | number,
    '9'?: boolean | number,
    '10'?: boolean | number,
    '11'?: boolean | number,
    '12'?:boolean | number,
    '13'?: boolean | number,
    'One-Size'?: boolean | number,
    'Adjustable'?: boolean | number,
}

export const SIZING_OPTIONS = (['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '8', '9', '10', '11', '12', '13', 'One-Size', 'Adjustable'] as (keyof SizeChart)[]);


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
    dimensions?: string | null;
    sizeGuide?: string[][]
    
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
    description?: string | null;
}