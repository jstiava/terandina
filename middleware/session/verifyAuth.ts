import type { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from "jose"

export default async function verifyToken(req: NextApiRequest): Promise<any> {
  // Verify the token is valid
  const authorizationHeader = req.headers.session;
  if (!authorizationHeader) {
    throw Error('Unable to authenticate. Token not provided in request.');
  }
  const token = String(authorizationHeader);

  // Verify token

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const { payload } = await jwtVerify(token, secret);

  const userAuth = payload;

  if (!userAuth) {
    throw Error('An error occurred while validating the token.');
  }

  return userAuth;
}
