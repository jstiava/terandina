import { GridRenderCellParams } from "@mui/x-data-grid";
import { Category } from "@/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import useManageSubCategories from "./useManageSubCategories";


export default function ManageSubcategories({ params, onChange, onSave, allCategories }: {
    params: GridRenderCellParams<Category, Category[] | null>,
    onChange: (files: Category[]) => any,
    onSave: (files: Category[]) => any,
    allCategories: Category[]
}) {

    const [categories, setCategories] = useState<Category[] | null>(null);

    const handleUpdate = (files: Category[]) => {
        // onChange(files);
        // console.log("Action")
        // fetch(`/api/categories?id=${params.id}`, {
        //     method: "PATCH",
        //     headers: {
        //         'Content-Type': "application/json"
        //     },
        //     body: JSON.stringify({
        //         categories: files
        //     })
        // })
    }

    useEffect(() => {

        const us: any[] = [];

        if (!params.value || !Array.isArray(params.value)) {
            setCategories(us);
            return;
        }

        if (params.value.length > 0 && typeof params.value[0] === 'string') {
            const expandedList = (params.value as any).map((x : string) => {
                const found = allCategories.find(c => c._id === x);
                if (!found) {
                    return null;
                }
                return found;
            });
            setCategories(expandedList);
            return;
        }

        setCategories(params.value);
    }, [params, params.value])

    const CategoryManager = useManageSubCategories(params.row, categories, setCategories, allCategories, {
        onChange: (files) => {
            onChange(files);
        },
        onSave: (files) => {
            onSave(files);
        },
        onRemoveAll: () => {
            handleUpdate([]);
        }
    })

    if (!categories) {
        return <CircularProgress color="primary" />
    }

    return (
        <>
            <div
                className="flex snug"
                onClick={(e) => {
                    e.stopPropagation();
                    CategoryManager.openDialog()
                }}
                style={{
                    height: "100%"
                }}
            >
                <Button
                    key={"Has content"}
                    onClick={(e) => {
                        e.stopPropagation();
                        CategoryManager.openDialog();
                    }}
                >
                    Open
                </Button>
            </div>
            {CategoryManager.FileUpload}
        </>
    )
}