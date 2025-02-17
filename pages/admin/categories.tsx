"use client"
import { headerHeight } from "@/layout/AuthProvider";
import { Category, StripeAppProps } from "@/types";
import { Typography, useMediaQuery } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";



export default function CategoryAdminPage(props: StripeAppProps) {
    const isSm = useMediaQuery("(max-width: 90rem)");

    const [categories, setCategories] = useState<Category[] | null>(null);

    const getCategories = async () => {

        const catFetch = await fetch(`/api/categories?doNotCache=true`);

        if (!catFetch.ok) {
            return;
        }

        const response = await catFetch.json();

        setCategories(response.categories);
    }

    useEffect(() => {
        getCategories();
    }, []);

    const columns = [
        {
            field: "name",
            headerName: "Name",
            width: 250,
        },
    ]

    return (
        <div id="content"
            className="column center"
            style={{
                padding: "1rem"
            }}>
            <div className={isSm ? "column left" : "column center"} style={{
                marginTop: headerHeight,
                maxWidth: "120rem",
                padding: "0.5rem",
                width: "100%"
            }}>
                <div className="flex">
                    {categories && (
                        <DataGrid
                            getRowId={(row) => {
                                return row._id;
                            }}
                            rows={categories}
                            columns={columns}
                            // editMode="row"
                            // getRowHeight={(params) => {
                            //     const row = products.find(x => x.id === params.id)
                            //     if (!row) return 100;
                            //     return Math.max(100, row.prices.length * 45)
                            // }}
                            checkboxSelection
                            // rowModesModel={rowModesModel}
                            // onRowModesModelChange={handleRowModesModelChange}
                            // onRowEditStop={handleRowEditStop}
                            // processRowUpdate={processRowUpdate}
                            // onRowSelectionModelChange={newRowSelectionModel => {
                            //     setRowSelectionModel(newRowSelectionModel);
                            // }}
                            // rowSelectionModel={rowSelectionModel}
                            // slots={{
                            //     toolbar: () => (
                            //         <EditToolbar
                            //             setProducts={setProducts}
                            //             selected={rowSelectionModel}
                            //             setSelected={setRowSelectionModel}
                            //         />
                            //     )
                            // }}
                            sx={{
                                width: "100%",
                                height: "calc(100vh - 7rem)"
                            }}
                        />
                    )}
                </div>
            </div>

        </div>
    )
}