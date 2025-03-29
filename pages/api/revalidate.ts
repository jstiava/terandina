import SafeString from "@/middleware/security";
import verifySession from "@/middleware/session/verifySession";
import Mongo from "@/utils/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { getProductById, handleUpdateProduct } from "./products";
import Stripe from "stripe";
import { StripeProduct } from "@/types";
import { uploadAllVersionsByBuffer } from "@/utils/utapi";


export async function getProductByIdFromStripe(product_id: string): Promise<Partial<StripeProduct> | null> {
    try {
        const mongo = await Mongo.getInstance();
        const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

        const product = await stripe.products.retrieve(product_id);
        if (!product) {
            return null;
        }

        const prices = await stripe.prices.list({
            product: product_id,
            active: true,
            limit: 100
        });

        console.log({
            ...product,
            prices: prices.data
        })

        if (!prices || !prices.data) {
            return product;
        }


        return {
            ...product,
            prices: prices.data.map(price => ({
                ...price,
                product: String(price.product)
            }))
        }
    } catch (error) {
        console.error("Error retrieving product:", error);
        return null;
    }
}

async function getAllProducts() {
    try {
        const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));
        const products = await stripe.products.list({
            limit: 100,
        });

        const prices = await stripe.prices.list({
            limit: 100,
            active: true
        })

        const productsWithPrices = products.data.map((product: Stripe.Product) => {
            return {
                ...product,
                prices: prices.data.filter((price: Stripe.Price) => price.product === product.id)
            }
        })

        return productsWithPrices;
    } catch (error) {
        console.error('Error retrieving products:', error);
    }
}


const fieldsFromStripe: (keyof StripeProduct)[] = ['name', 'description', 'prices', 'active'];

export default async function handleRequest(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {

    if (req.method != 'GET') {
        res.status(405).end('Method Not Allowed');
    }

    const userAuth = verifySession(req);
    if (!userAuth) return res.status(401).json({ message: 'Usage' });

    const mongo = await Mongo.getInstance();


    try {

        if (req.query.product_id) {
            const product = await getProductByIdFromStripe(req.query.product_id.toString());
            if (!product) {
                await mongo.clientPromise.db('products').collection('products').deleteOne({
                    id: req.query.product_id.toString()
                });
                return res.status(201).json({
                    message: "Product not found in Stripe. Delete this.",
                    product: null
                })
            }

            const sendFromStripeToDatabase: any = {};

            for (const key of fieldsFromStripe) {
                if (key in product) {
                    sendFromStripeToDatabase[key] = product[key];
                }
            }

            const ourCopy = await getProductById(req.query.product_id.toString());

            try {
                if (ourCopy) {
                    if (product.images && (!ourCopy.media || ourCopy.media.length === 0)) {
                        const allMedia: any = [];
                        for (const image of product.images) {
                            const firstFile = await fetch(image);
                            const buffer = await firstFile.arrayBuffer();
                            const mediaValue = await uploadAllVersionsByBuffer(ourCopy.name, buffer);
                            allMedia.push(mediaValue);
                        }
                        sendFromStripeToDatabase.media = allMedia;
                        sendFromStripeToDatabase.images = [];
                    }
                }
            }
            catch (err) {
                console.error(err);
            }

            await mongo.clientPromise.db('products').collection('products').updateOne(
                { id: product.id },
                {
                    $set: sendFromStripeToDatabase,
                }
            );

            let theProduct = await getProductById(req.query.product_id.toString());

            if (!theProduct) {
                await mongo.clientPromise.db('products').collection('products').insertOne({
                    ...product,
                    prices: [],
                    selectedPrice: null,
                    quantity: 1
                });
                theProduct = await getProductById(req.query.product_id.toString());
            }


            return res.status(200).json({
                message: "Success",
                product: theProduct
            })
        }


        throw Error("Cannot revalidate wholesale anymore.");

        // const products = await getAllProducts();


        // if (!products) {
        //     throw Error("No products.")
        // }

        // await mongo.clientPromise.db('products').collection('products').deleteMany({});
        // await mongo.clientPromise.db('products').collection('products').insertMany(products);

        // res.status(200).json({
        //     message: "Success"
        // })
    } catch (err) {
        console.log(err);
    }
    return res.status(500).json("Something went wrong.");
}