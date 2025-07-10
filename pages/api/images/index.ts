import SafeString from "@/middleware/security";
import { getListOfUploadedThings } from "@/utils/utapi";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handleRequest(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {

  if (req.method != 'GET') {
    res.status(405).end('Method Not Allowed');
  }

  const product_id = req.query.id;
  const doNotCache = new SafeString(req.query.doNotCache);

  const images = await getListOfUploadedThings();

  res.status(200).json({ images })
  return;
}