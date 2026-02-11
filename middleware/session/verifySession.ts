import cookie from 'cookie';
import { jwtVerify } from "jose"
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

export default async function verifySession(req: NextApiRequest): Promise<any | null> {
  try {
    // Verify the token is valid
    const cookies = req.headers.cookie;
    console.log(cookies);
    if (!cookies) {
      console.error('Token not provided');
      throw Error('Unable to authenticate. Token not provided in request.');
    }
    const tokens = String(cookies).split('; ');

    const session = tokens.find(element => element.startsWith('session'));
    const sessionToken = session?.split('=')[1];

    if (!sessionToken) {
      console.error('Token not found');
      throw Error('An error occured while getting the session.');
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)

    const { payload } = await jwtVerify(sessionToken, secret)

    const userAuth = payload


    if (!userAuth || !userAuth.username || !userAuth.uuid) {
      console.error('Token not valid.');
      throw Error('An error occurred while validating the token.');
    }

    return userAuth;
  } catch (err) {
    console.log(err)
    return null;
  }
}
