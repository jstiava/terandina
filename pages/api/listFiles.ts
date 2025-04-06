import { getListOfUploadedThings, uploadAllVersionsByBuffer, uploadImage } from '@/utils/utapi';
import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import { getAllProducts, handleUpdateProduct } from './products';
import { TerandinaImage } from '@/types';
import Stripe from 'stripe';
import { getAllProductsFromStripe } from './revalidate';
import Mongo from '@/utils/mongo';

const UPLOAD_THING_PREFIX = 'https://65bog6nsnm.ufs.sh/f/';

export default async function handleRequest(
    req: NextApiRequest,
    res: NextApiResponse<any>,
): Promise<any> {

    if (req.method !== 'GET') {
        return res.status(400).json({ message: 'Method Not Allowed' });
    }

    const log = [];
    const notInMongo = [];
    const stripeProducts = await getAllProductsFromStripe();
    const mongoProducts = await getAllProducts();
    const mongo = await Mongo.getInstance();


    if (!stripeProducts || !mongoProducts) {
        return res.status(400).json({ message: "Something went wrong."})
    }

    for (const sP of stripeProducts) {
        if (mongoProducts.some(mP => mP.id === sP.id)) {
            log.push(`${sP.id} found.`);
            continue;
        }

        const product = sP;
        try {
            if (product.images) {
              const allMedia: any = [];
              for (const image of product.images) {
                const firstFile = await fetch(image);
                const buffer = await firstFile.arrayBuffer();
                const mediaValue = await uploadAllVersionsByBuffer(product.name, buffer);
                allMedia.push(mediaValue);
              }
              (product as any).media = allMedia;
              product.images = [];
            }
          }
          catch (err) {
            console.error(err);
          }
    

          const newObject = {
            ...product,
            prices: product.prices || [],
            selectedPrice: null,
            quantity: 1
          }
    
          await mongo.clientPromise.db('products').collection('products').insertOne(newObject);
          notInMongo.push(newObject.id);
    }

    return res.status(200).json({
        message: "Done",
        log,
        notInMongo
    })

    throw Error("Not valid")

}
