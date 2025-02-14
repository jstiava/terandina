import { GridRenderCellParams } from "@mui/x-data-grid";
import CoverImage from "./CoverImage";
import { StripeProduct } from "@/types";
import useComplexFileDrop, { UploadType } from "./useComplexFileDrop";
import { useState } from "react";
import { ClientUploadedFileData } from "uploadthing/types";


export default function ManagePhotosField({ params, onChange }: {
    params: GridRenderCellParams<StripeProduct, string[]>,
    onChange: (files: string[]) => any
}) {



    const [uploads, setUploads] = useState<UploadType[]>([]);
    const FileDrop = useComplexFileDrop(params.row.images, uploads, setUploads, {
        onInsert: (files: UploadType[]) => {
            onChange(files.map(x => x.url))
            return;
        },
        onDelete: (files: UploadType[]) => {
            onChange(files.map(x => x.url))
            return;
        }
    })

    return (
        <>
            <div onClick={(e) => {
                e.stopPropagation();
                FileDrop.openDialog()
            }}>
                {params.value && params.value.map(url => (
                    <div
                        key={url}
                        style={{
                            height: "100%",
                            width: "100%",
                            padding: "0.5rem"
                        }}
                    >
                        <CoverImage
                            url={url}
                            width={"60px"}
                            height={"70px"}
                        />
                    </div>
                ))}
            </div>
            {FileDrop.FileUpload}
        </>
    )
}