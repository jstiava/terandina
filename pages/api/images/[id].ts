// /pages/api/image-redirect.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // expects ?filename=zzMJdtYl...Ny1.webp

  if (typeof id !== 'string' || !id.includes('.')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  const key = id.split('.')[0]; // removes extension
  const redirectUrl = `https://65bog6nsnm.ufs.sh/f/${key}`;

  res.redirect(302, redirectUrl);
}
