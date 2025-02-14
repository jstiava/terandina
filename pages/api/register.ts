import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import SafeString from '@/middleware/security';

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>,
) {
  // method check, must be a POST
  if (req.method !== 'POST') return res.status(400).json({ message: 'Method Not Allowed' });

  return res.status(404).json({ message: "Not found"})

  // Type checking and santized request
  const name = new SafeString(req.body.name);
  const username = new SafeString(req.body.username);
  const email = new SafeString(req.body.email);
  const password = req.body.password;

  const newProfile = {
    uuid: uuidv4(),
    name: name.toString() || username.toString(),
    nickname: name.toString() || username.toString(),
    username: username.toString(),
    email: email.toString(),
    passkey: '',
    valid: false,
  };
  try {
    newProfile.passkey = await bcrypt.hash(password, 10);
  } catch (error) {
    console.error('Error hashing password:', error);
    return res.status(401).json({ message: 'Something went wrong.' });
  }

  try {

    // make new
    return res.status(200).json({ message: 'New Profile Added Successfully' });

  } catch (error: any) {

    if (error.code === '23505') {
      console.error('Error: That ');
      return res.status(400).json({ message: "There is an account already associated with these credentials." })
    }
    console.error('Error creating profile:', error);
    res.status(401).json({ message: 'Internal Server Error' });
    return;
  }
}
