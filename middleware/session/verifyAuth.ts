import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import { ProfileTokenDecrypted } from '@/types/globals';

export default function verifyToken(req: NextApiRequest): ProfileTokenDecrypted {
  // Verify the token is valid
  const authorizationHeader = req.headers.session;
  if (!authorizationHeader) {
    throw Error('Unable to authenticate. Token not provided in request.');
  }
  const token = String(authorizationHeader);

  // Verify token
  const userAuth = jwt.verify(token, process.env.JWT_SECRET as Secret) as ProfileTokenDecrypted;
  if (!userAuth) {
    throw Error('An error occurred while validating the token.');
  }

  return userAuth;
}
