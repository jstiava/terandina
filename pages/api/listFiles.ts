import { getListOfUploadedThings, uploadImage } from '@/utils/utapi';
import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import { getAllProducts, handleUpdateProduct } from './products';
import { TerandinaImage } from '@/types';

const UPLOAD_THING_PREFIX = 'https://65bog6nsnm.ufs.sh/f/';

export default async function handleRequest(
    req: NextApiRequest,
    res: NextApiResponse<any>,
): Promise<any> {

    if (req.method !== 'GET') {
        return res.status(400).json({ message: 'Method Not Allowed' });
    }

    throw Error("Not valid")

}
