"use client"
import { headerHeight } from "@/layout/AuthProvider";
import { StripePrice, StripeProduct } from "@/types";
import { OurFileRouter, useUploadThing } from "@/utils/uploadthing";
import { Button, IconButton, TextField, Typography, useMediaQuery } from "@mui/material";
import { useState, useEffect } from "react";
import {
    GridColDef,
    GridRenderCellParams,
    DataGrid,
    useGridApiRef,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridRowSelectionModel,
    GridRenderEditCellParams,
    GridComparatorFn,
    GridActionsCellItem,
    GridRowModesModel,
    GridEventListener,
    GridRowEditStopReasons,
    GridRowModes,
    GridRowModel,
    GridRowId,
} from '@mui/x-data-grid';
import CoverImage from "@/components/CoverImage";
import { AddOutlined, CancelOutlined, DeleteOutlined, EditOutlined, MinimizeOutlined, PhotoAlbumOutlined, PhotoOutlined, RemoveOutlined, SaveOutlined } from "@mui/icons-material";
import { formatPrice } from "@/components/ProductCard";
import useComplexFileDrop, { UploadType } from "@/components/useComplexFileDrop";
import ManagePhotosField from "@/components/ManagePhotosField";

const MAX_IMAGES = 3;


const alphaComparator: GridComparatorFn<string> = (v1, v2) => {
    if (v1 < v2) return -1;
    if (v1 > v2) return 1;
    return 0;
};

const nameAlphaComparator: GridComparatorFn<any> = (v1, v2, cellParams1, cellParams2) => {
    return alphaComparator(
        v1.name,
        v2.name,
        cellParams1,
        cellParams2,
    );
};


export default function AdminPage() {

    const [images, setImages] = useState<UploadType[]>([]);

    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const [products, setProducts] = useState<StripeProduct[] | null>(null);
    const isSm = useMediaQuery("(max-width: 90rem)");



    const processRowUpdate = (newRow: GridRowModel<StripeProduct>) => {
        setProducts((prev) => {
            if (!prev) return null;
            const newList = prev.map((row) => (row.id === newRow.id ? newRow : row));
            return newList;
        });
        return newRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };


    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    };

    const columns: GridColDef<StripeProduct>[] = [
        {
            field: "images",
            headerName: "Images",
            sortable: false,
            width: 100,
            renderCell: (params: GridRenderCellParams<StripeProduct, string[]>) => <ManagePhotosField key={params.row.id} params={params} onChange={(uploads) => {
                const row = products?.find(x => params.row.id);
                if (!row) {
                    return;
                }
                processRowUpdate({
                    ...row,
                    images: uploads
                })
            }} />
        },
        {
            field: "name",
            headerName: "Name",
            width: 250,
            editable: true,
            renderCell: (params: GridRenderCellParams<StripeProduct, string>) => {

                return (
                    <div className="column snug left" style={{
                        padding: "0.5rem"
                    }}
                    >
                        <Typography >{params.value}</Typography>
                        {/* <div className="flex compact">
                            <Button 
                            variant="text"
                            sx={{
                                height: "2rem"
                            }}
                            onClick={e => {
                                e.stopPropagation();
                            }}
                            startIcon={
                                <PhotoAlbumOutlined fontSize="small" />
                            }>Manage Photos</Button>
                        </div> */}
                    </div>
                )
            }
        },
        {
            field: "description",
            headerName: "Description",
            width: 300,
            editable: true,
            renderCell: (params: GridRenderCellParams<StripeProduct, string>) => {
                return (
                    <Typography sx={{
                        width: "100%",
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal',
                        lineHeight: "115%",
                        height: "100%",
                        overflowY: "scroll",
                        padding: "0.5rem 1rem"
                    }}>{params.value}</Typography>
                )
            }
        },
        {
            field: "prices",
            headerName: "Price & Quantity",
            width: 300,
            sortable: false,
            renderCell: (params: GridRenderCellParams<StripeProduct, StripePrice[]>) => {
                return (
                    <div className="column snug" style={{
                        height: "100%",
                        overflowY: 'scroll',
                        padding: "0.5rem"
                    }}>
                        {params.value && params.value.map(price => (
                            <div className="flex between" key={price.id}>
                                <div className="flex fit">
                                    {price.nickname && (<Typography variant="caption" sx={{
                                        padding: 0
                                    }}>{price.nickname}</Typography>)}
                                    {price.unit_amount && (
                                        <Typography>{formatPrice(price.unit_amount * 1, price.currency)}</Typography>
                                    )}
                                </div>
                                <div className="flex fit" style={{
                                    padding: "0.5rem"
                                }}>
                                    <TextField
                                        size="small"
                                        value={price.inventory || 100}
                                        InputProps={{
                                            endAdornment: (
                                                <div className="flex snug fit">
                                                    <IconButton><AddOutlined fontSize="small" /></IconButton>
                                                    <IconButton><RemoveOutlined fontSize="small" /></IconButton>
                                                </div>
                                            )
                                        }}
                                        sx={{
                                            width: "8rem"
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            key="save"
                            icon={<SaveOutlined />}
                            label="Save"
                            color="primary"
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            key="cancel"
                            icon={<CancelOutlined />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        key="edit"
                        icon={<EditOutlined />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />
                ];
            },
        },


    ]

    const getProducts = async () => {

        let productList = [];
        let i = 0;

        const productsFetch = await fetch(`/api/products?doNotCache=true`);

        if (!productsFetch.ok) {
            return;
        }

        const response = await productsFetch.json();

        for (i; i < response.products.length; i++) {
            const product = response.products[i];
            if (!product.prices || product.prices.length === 0) {
                productList.push({
                    ...product,
                    quantity: 1,
                    selectedPrice: null
                })
                continue;
            }
            productList.push({
                ...product,
                quantity: 1,
                selectedPrice: product.prices[0]
            })
        }

        setProducts(productList);
    }

    useEffect(() => {
        getProducts();
    }, []);



    const { startUpload, isUploading } = useUploadThing('imageUploader', {
        onClientUploadComplete: (res) => {
            if (res) {
                res.forEach((uploadedFile) => {
                    console.log(uploadedFile)
                    // append({
                    //   url: uploadedFile.url,
                    //   altText: productName,
                    //   isPrimary: images.length === 0,
                    // });
                });
            }
        },
        onUploadError: (error) => {
            console.error("Upload error:", error);
        },
    })

    const addImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            const remainingSlots = MAX_IMAGES - images.length;
            const filesToUpload = files.slice(0, remainingSlots);

            if (filesToUpload.length > 0) {
                startUpload(filesToUpload);
            }
        }
    };

    if (!products) {
        return <></>
    }

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

                <div className="flex" style={{
                    width: "100%"
                }}>
                    <DataGrid
                        getRowId={(row) => {
                            return row.id;
                        }}
                        rows={products}
                        columns={columns}
                        editMode="row"
                        getRowHeight={(params) => {
                            const row = products.find(x => x.id === params.id)
                            if (!row) return 100;
                            return Math.max(100, row.prices.length * 70)
                        }}
                        checkboxSelection
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        // slots={{ toolbar: EditToolbar }}
                        // slotProps={{
                        //     toolbar: { setRows, setRowModesModel },
                        // }}
                        sx={{
                            width: "100%",
                            height: "calc(100vh - 7rem)"
                        }}
                    />
                </div>
            </div>
        </div>
    )
}


