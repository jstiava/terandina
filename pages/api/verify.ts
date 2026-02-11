import bcrypt from 'bcrypt';
import cookie from 'cookie';
import { ProfilingLevel } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import verifySession from '@/middleware/session/verifySession';
import SafeString from '@/middleware/security';
import Mongo from '@/utils/mongo';

export default async function handleRequest(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    let profile: any | null = null;

    const userAuth = await verifySession(req);
    if (!userAuth) return res.status(401).json({ message: 'Usage' });


    const mongo = await Mongo.getInstance()

    if (profile === null) {
        try {
            profile = {
                uuid: "test",
                name: "Admin account"
            }
            try {
                delete profile!.passkey;
            } catch (err) {
                console.log('Error ocurred while pushing to redis');
            }
        } catch (error) {
            return res.status(405).json({ message: 'Something went wrong' });
        }
    }


    if (!profile) {
        return res.status(405).json({ message: 'Usage.' });
    }

    return res.status(200).json({ message: 'None found.', session: profile, memberships: [] });

}
