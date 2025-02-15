import { GridRenderCellParams } from "@mui/x-data-grid";
import CoverImage from "./CoverImage";
import { StripeProduct } from "@/types";
import useComplexFileDrop, { UploadType } from "./useComplexFileDrop";
import { useState } from "react";
import { ClientUploadedFileData } from "uploadthing/types";
import { CircularProgress } from "@mui/material";


export default function ManagePhotosField({ params, onChange }: {
    params: GridRenderCellParams<StripeProduct, string[]>,
    onChange: (files: string[]) => any
}) {



    const [uploads, setUploads] = useState<UploadType[]>([]);

    const handleUpdate = (files: UploadType[]) => {
        const theImages = files.map(x => x.url);
        onChange(theImages);
        fetch(`/api/products?id=${params.row.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                images: theImages
            })
        })
    }

    const FileDrop = useComplexFileDrop(params.row.images, uploads, setUploads, {
        onLoading: () => {

        },
        onInsert: (files: UploadType[]) => {
            handleUpdate(files);
            return;
        },
        onDelete: (files: UploadType[]) => {
            handleUpdate(files);
            return;
        }
    })

    if (!uploads) {
        return <CircularProgress color="primary" />
    }

    return (
        <>
            <div
                className="flex compact"
                onClick={(e) => {
                    e.stopPropagation();
                    FileDrop.openDialog()
                }}>
                {uploads.map(upload => (
                    <div
                        key={upload.url}
                        style={{
                            height: "100%",
                            width: "fit-content",
                            padding: "0.5rem"
                        }}
                    >
                        <CoverImage
                            url={upload.url}
                            width={"60px"}
                            height={"70px"}
                            style={{
                                borderRadius: "0.25rem"
                            }}
                        />
                    </div>
                ))}
            </div>
            {FileDrop.FileUpload}
        </>
    )
}