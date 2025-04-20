import SafeString from '@/middleware/security';
import Mongo from '@/utils/mongo';
import bcrypt from 'bcrypt';
import cookie from 'cookie';
import jwt, { Secret } from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
// import { v4 as uuidv4 } from "uuid";
import validator from 'validator';

interface LoginProfileGuess {
    username: string,
    password: string
}

export default async function handleRequest(
    req: NextApiRequest,
    res: NextApiResponse<any>,
): Promise<void> {
    // method check, must be a POST
    if (req.method !== 'POST') {
        return res.status(400).json({ message: 'Method Not Allowed' });
    }

    try {
        const name = new SafeString(req.body.name).toString();
        const email = new SafeString(req.body.email).toString();
        const message = new SafeString(req.body.message).toString();

        const mongo = await Mongo.getInstance();

        await mongo.clientPromise.db('users').collection('subscibers').insertOne({
            name,
            message,
            email,
            created_on: new Date()
        })

        return res.status(201).json({
            message: "Login successful"
        });
    }
    catch (err) {
        return res.status(400).json({ message: 'Error' });
    }
}
