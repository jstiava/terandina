import { GridRenderCellParams } from "@mui/x-data-grid";
import CoverImage from "./CoverImage";
import { StripeProduct } from "@/types";
import useComplexFileDrop, { UploadType } from "./useComplexFileDrop";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ClientUploadedFileData } from "uploadthing/types";
import { CircularProgress, IconButton } from "@mui/material";
import { useUploadThing } from "@/utils/uploadthing";
import { AddAPhotoOutlined, AspectRatio } from "@mui/icons-material";


export default function ManagePhotosField({ params, onChange }: {
    params: GridRenderCellParams<StripeProduct, string[]>,
    onChange: (files: string[]) => any
}) {

    const [uploads, setUploads] = useState<UploadType[] | null>(null);

    const handleUpdate = (files: UploadType[]) => {
        const theImages = files.map(x => x.url);
        onChange(theImages);
        console.log("Action")
        fetch(`/api/products?id=${params.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                images: theImages
            })
        })
    }

    useEffect(() => {
        setUploads(params.row.images.map(image => ({
            url: image,
            size: 0,
            isLocal: false
        })))
    }, [])

    const FileDrop = useComplexFileDrop(uploads, setUploads, {
        onChange: (files) => {
            handleUpdate(files);
        },
       onRemoveAll: () => {
        handleUpdate([]);
       }
    })

    if (!uploads) {
        return <CircularProgress color="primary" />
    }

    return (
        <>
            <div
                className="flex snug"
                onClick={(e) => {
                    e.stopPropagation();
                    FileDrop.openDialog()
                }}
                style={{
                    height: "100%"
                }}
                >
                {uploads && uploads.length != 0 ? uploads.map(upload => (
                    <div
                        key={upload.url}
                        style={{
                            height: "100%",
                            width: "fit-content",
                            padding: "0.5rem",
                        }}
                    >
                        <CoverImage
                            url={upload.url}
                            width={"80px"}
                            height={"80px"}
                            style={{
                                borderRadius: "0.25rem",
                            }}
                        />
                    </div>
                )) : (
                    <div className="flex center middle" style={{
                        height: "100%"
                    }}>
                        <IconButton onClick={(e) => {
                            e.stopPropagation();
                            FileDrop.openDialog();
                        }}>
                            <AddAPhotoOutlined />
                        </IconButton>
                    </div>
                )}
            </div>
            {FileDrop.FileUpload}
        </>
    )
}