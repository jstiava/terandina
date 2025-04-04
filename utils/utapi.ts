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


export const uploadAllVersionsByBuffer = async (name: string, buffer: ArrayBuffer) => {

    const mediaValue: TerandinaImage = {
        small: null,
        medium: null,
        large: null
    }
    
    
    try {

        const compressedBufferSmall = await sharp(Buffer.from(buffer))
            .resize(70)
            .webp()
            .toBuffer();

        const compressedBufferMedium = await sharp(Buffer.from(buffer))
        .resize(500)
        .webp()
        .toBuffer();


        const compressedBufferLarge = await sharp(Buffer.from(buffer))
        .resize(1000)
        .webp()
        .toBuffer();    


        const uploaded = await uploadImage([
            new File([compressedBufferSmall], `small-${name}.webp`, { type: "image/webp" }),
            new File([compressedBufferMedium], `medium-${name}.webp`, { type: "image/webp" }),
            new File([compressedBufferLarge], `large-${name}.webp`, { type: "image/webp" }),
        ]);

        if (uploaded && uploaded.length === 3) {

            return {
                small: uploaded[0].data?.ufsUrl,
                medium: uploaded[1].data?.ufsUrl,
                large: uploaded[2].data?.ufsUrl,
            }
        }
        throw Error("Did not work.")
          
    }
    catch (err) {
        console.log(err);
        throw Error("Failure")
    }
}



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
            const firstFile = await fetch(file.ufsUrl);
            const buffer = await firstFile.arrayBuffer();
            const mediaValue = await uploadAllVersionsByBuffer(file.name, buffer);
            await deleteFiles([file.key]);

            return { uploadedBy: metadata.userId, ...JSON.parse(JSON.stringify(mediaValue)) };
        }),

} satisfies FileRouter;


export type OurFileRouter = typeof ourFileRouter;


export const getListOfUploadedThings = async () => {
    return await utapi.listFiles();
}

export const uploadImage = async (files: File[]) => {
    return await utapi.uploadFiles(files)
}

export const deleteFiles = async (keys: string[]) => {
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
