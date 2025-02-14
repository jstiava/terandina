import {
    generateUploadButton,
    generateUploadDropzone,
    generateReactHelpers
} from "@uploadthing/react";

import type { NextApiRequest, NextApiResponse } from "next";

import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = async (req: NextApiRequest, res: NextApiResponse) => {

    

    return { id: "fakeid" }
};

export const ourFileRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        .middleware(async ({ req, res }) => {
            const user = await auth(req, res);
            if (!user) throw new UploadThingError("Unauthorized");
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);
            return { uploadedBy: metadata.userId };
        }),

} satisfies FileRouter;



export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>()
export type OurFileRouter = typeof ourFileRouter