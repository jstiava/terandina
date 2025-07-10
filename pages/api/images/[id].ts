// pages/api/image-proxy.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string' || !id.includes('.')) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const key = id.split('.')[0];
  const imageUrl = `https://65bog6nsnm.ufs.sh/f/${key}`;

  try {
    const imageRes = await fetch(imageUrl);

    if (!imageRes.ok) {
      return res.status(imageRes.status).json({ error: 'Image not found' });
    }

    const contentType = imageRes.headers.get('content-type') || 'application/octet-stream';
    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length.toString());
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    res.status(200).send(buffer);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
}
