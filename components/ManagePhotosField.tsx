import { GridRenderCellParams } from "@mui/x-data-grid";
import CoverImage from "./CoverImage";
import { Category, StripeProduct, TerandinaImage } from "@/types";
import useComplexFileDrop, { UploadType } from "./useComplexFileDrop";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ClientUploadedFileData } from "uploadthing/types";
import { Alert, AlertTitle, CircularProgress, IconButton } from "@mui/material";
import { useUploadThing } from "@/utils/uploadthing";
import { AddAPhotoOutlined, AspectRatio } from "@mui/icons-material";


export default function ManagePhotosField({ params, onChange, type }: {
    params: GridRenderCellParams<StripeProduct | Category, string[]>,
    onChange: (files: TerandinaImage[]) => any,
    type: 'categories' | 'products'
}) {

    const [uploads, setUploads] = useState<UploadType[] | null>(null);

    const handleUpdate = (files: UploadType[]) => {
        const theImages = files.map(x => ({
            small: x.small,
            medium: x.medium,
            large: x.large
        } as TerandinaImage));
        onChange(theImages);
        console.log("Action")
        fetch(`/api/${type}?id=${params.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                media: theImages
            })
        })
    }

    useEffect(() => {

        const us : any[] = [];

        if (!params.row.media) {
            setUploads(us);
            return;
        }

        for (const media of params.row.media) {
            if (media.small) {
                us.push({
                    ...media,
                    url: media.small,
                    size: 0,
                    isLocal: false
                })
            }
        }

        setUploads(us);
    }, [params, params.value])

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