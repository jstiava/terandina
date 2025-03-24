"use server"

import sharp from "sharp";
import { createUploadthing, FileRouter, UploadThingError, UTApi } from "uploadthing/server";
import crypto from 'crypto';
import { TerandinaImage } from "@/types";
import verifySession from "@/middleware/session/verifySession";
import { NextApiRequest, NextApiResponse } from "next";


const utapi = new UTApi();


const f = createUploadthing();

const auth = async (req: any, res: any) => {

    const userAuth = verifySession(req);
    if (!userAuth) return res.status(401).json({ message: 'Usage' });

    return { userAuth }
};

export const ourFileRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "8MB",
            maxFileCount: 3,
        },
    })
        .middleware(async ({ req, res }) => {
            const user = await auth(req, res);
            if (!user) throw new UploadThingError("Unauthorized");
            return { userId: user.userAuth.uuid };
        })
        .onUploadError((err) => {
            console.log(err)
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);

            const mediaValue : TerandinaImage = {
                small: null,
                medium: null,
                large: null
            }

            const firstFile = await fetch(file.ufsUrl);
            const buffer = await firstFile.arrayBuffer();

            try {
                const compressedBufferSmall = await sharp(Buffer.from(buffer))
                    .resize(70)
                    .webp()
                    .toBuffer();

                const uploadResponseSmall = await uploadImage(new File([compressedBufferSmall], `small-${file.name}.webp`, { type: "image/webp" }));
                if (!uploadResponseSmall.data) {
                    throw Error("Small image did not upload")
                }
                mediaValue.small = String(uploadResponseSmall.data.ufsUrl);
            }
            catch (err) {
                console.log("Error with small image")
            }

            try {
                const compressedBufferMedium = await sharp(Buffer.from(buffer))
                    .resize(500)
                    .webp()
                    .toBuffer();

                const uploadResponseMedium = await uploadImage(new File([compressedBufferMedium], `medium-${file.name}.webp`, { type: "image/webp" }));
                if (!uploadResponseMedium.data) {
                    throw Error("Medium image did not upload")
                }
                mediaValue.medium = String(uploadResponseMedium.data.ufsUrl);
            }
            catch (err) {
                console.log("Error with medium image")
            }


            try {
                const compressedBufferLarge = await sharp(Buffer.from(buffer))
                    .resize(1000)
                    .webp()
                    .toBuffer();

                const uploadResponseLarge = await uploadImage(new File([compressedBufferLarge], `large-${file.name}.webp`, { type: "image/webp" }));
                if (!uploadResponseLarge.data) {
                    throw Error("Large image did not upload")
                }
                mediaValue.large = String(uploadResponseLarge.data.ufsUrl);
            }
            catch (err) {
                console.log("Error with large image")
            }


            console.log(file);
            await deleteFiles([file.key]);

            return { uploadedBy: metadata.userId, ...JSON.parse(JSON.stringify(mediaValue)) };
        }),

} satisfies FileRouter;


export type OurFileRouter = typeof ourFileRouter;


export const getListOfUploadedThings = async () => {
    return await utapi.listFiles();
}

export const uploadImage = async (file : File) => {
    return await utapi.uploadFiles(file)
}

export const deleteFiles = async (keys : string[]) => {
    return await utapi.deleteFiles(keys)
}


export async function hashFile(file: File): Promise<string> {
    const hash = crypto.createHash("sha256"); // Create a SHA-256 hash
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        try {
          const buffer = Buffer.from(reader.result as ArrayBuffer); 
          hash.update(buffer); 
          const fileHash = hash.digest("hex");
          resolve(fileHash);
        } catch (error) {
          reject(error);
        }
      };
  
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }

export async function compressAndUploadAsWebp(file: File, quality = 100) {
  try {
    const buffer = await file.arrayBuffer(); // Convert File to Buffer

    const compressedBuffer = await sharp(Buffer.from(buffer))
      .resize({ width: 1000 }) // Resize to max 1000px width (optional)
      .webp({ quality }) // Convert to WebP and set quality to 75%
      .toBuffer();

    // Convert buffer back to a File object
    const compressedFile = new File([compressedBuffer], file.name.replace(/\.[^.]+$/, ".webp"), {
      type: "image/webp",
    });

    // Upload to UploadThing
    const res = await utapi.uploadFiles(compressedFile);
    return res;
  } catch (error) {
    console.error("Error compressing/uploading file:", error);
    throw error;
  }
}
