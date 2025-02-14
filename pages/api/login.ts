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
  if (req.method !== 'POST') return res.status(400).json({ message: 'Method Not Allowed' });

  const guess: LoginProfileGuess = req.body;
  console.log(guess)

  const sanitizedUsername = validator.escape(guess.username);
  if (
    !sanitizedUsername ||
    typeof sanitizedUsername !== 'string'
    // || spaceRegex.test(sanitizedUsername)
  ) {
    return res.status(401).json({ message: 'Invalid username input' });
  }

  let profile: any | null = {
    username: "Admin",
    uuid: "admin"
  };

  if (guess.password != process.env.ADMIN_SECRET) {
    console.log({
      guess: guess.password,
      correct: process.env.ADMIN_SECRET
    })
    return res.status(401).json({ message: 'Failed to login' });
  }

  const cookies: string[] = [];
  const token = jwt.sign(
    { username: profile!.username, uuid: profile!.uuid },
    process.env.JWT_SECRET as Secret,
  );
  cookies.push(
    cookie.serialize('session', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1
      path: '/',
    }),
  );
  res.setHeader('Set-Cookie', cookies);

  return res.status(201).json({
    message: "Login successful"
  });
}
