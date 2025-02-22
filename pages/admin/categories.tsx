"use client"
import { headerHeight } from "@/layout/AuthProvider";
import { Category, StripeAppProps } from "@/types";
import { Button, TextField, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";



export default function CategoryAdminPage(props: StripeAppProps) {
    const isSm = useMediaQuery("(max-width: 90rem)");
    const router = useRouter();

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
            width: 200,
        },
        {
            field: "type",
            headerName: "Type",
            width: 100,
            renderCell: (params: GridRenderCellParams<Category, string>) => {
                return params.value === 'variant' ? "Variant" : "Collection"
            }
        },
        {
            field: "description",
            headerName: "Description",
            width: 300,
            editable: true,
            renderEditCell: (params : GridRenderCellParams<Category, string | null>) => {
                return (
                    <div className="flex top" style={{
                        width: "100%",
                        height: "100%"
                    }}>
                        <TextField
                            sx={{
                                width: "100%",
                                height: "100%",
                                overflowY: "scroll",
                                '& .MuiInputBase-root': {
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    width: "100%",
                                    height: "fit-content",
                                    padding: "0.5rem 1rem",
                                    minHeight: "100%"
                                },
                                '& textarea': {
                                    whiteSpace: 'pre-wrap',
                                    fontSize: "1rem",
                                    lineHeight: "100%",
                                    minHeight: "100%"
                                }
                            }}
                            onChange={e => {
                                if (e.target.value === null) {
                                    return;
                                }
                                params.api.setEditCellValue({
                                    id: params.id,
                                    field: params.field,
                                    value: e.target.value
                                })
                            }}
                            value={params.value}
                            multiline
                        />
                    </div>
                )
            },
            renderCell: (params: GridRenderCellParams<Category, string>) => {
                return (
                    <Typography sx={{
                        width: "100%",
                        overflowWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        lineHeight: "115%",
                        height: "100%",
                        overflowY: "scroll",
                        padding: "0.5rem 1rem"
                    }}>{params.value}</Typography>
                )
            }
        },
    ]

    return (
        <div id="content"
            className="column center"
            style={{
                padding: "1rem"
            }}>
            <div className={isSm ? "column left" : "column left"} style={{
                marginTop: headerHeight,
                maxWidth: "120rem",
                padding: "0.5rem",
                width: "100%"
            }}>
                   <div className="flex fit">
                   <Button
                    variant="outlined"
                    onClick={e => {
                        router.push('/admin')
                    }}
                    >Edit Products</Button>
                   </div>
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