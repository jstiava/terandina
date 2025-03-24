"use client"
import verifySession from "@/middleware/session/verifySession";
import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";

import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { UploadThingError, UTApi } from "uploadthing/server";
import { deleteFiles, OurFileRouter, uploadImage } from "./utapi";
import { TerandinaImage } from "@/types";
import { generateUploadButton, generateUploadDropzone, generateReactHelpers } from "@uploadthing/react";


export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();


