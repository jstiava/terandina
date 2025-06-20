"use client"
import { headerHeight } from "@/layout/AuthProvider";
import { Category, SizeChart, SIZING_OPTIONS, StripePrice, StripeProduct } from "@/types";
import { Button, ButtonBase, Checkbox, Chip, FormControl, IconButton, InputLabel, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery, useTheme, MenuItem as MuiMenuItem } from "@mui/material";
import { useState, useEffect, Dispatch, SetStateAction, useRef } from "react";
import {
    GridColDef,
    GridRenderCellParams,
    DataGrid,
    GridToolbarContainer,
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
    GridFilterItem,
    GridFilterModel,
    GridFilterOperator,
    GridFilterInputValueProps,
} from '@mui/x-data-grid';
import { AddOutlined, ArchiveOutlined, CancelOutlined, CategoryOutlined, CheckroomOutlined, ChevronRight, CloseOutlined, DeleteOutlined, EditOutlined, ErrorOutline, GroupWorkOutlined, Inventory2Outlined, OpenInNew, RemoveOutlined, SaveOutlined } from "@mui/icons-material";
import ProductCard, { DisplayPrice, formatPrice } from "@/components/ProductCard";
import { UploadType } from "@/components/useComplexFileDrop";
import ManagePhotosField from "@/components/ManagePhotosField";
import { zain_sans_font } from "@/styles/theme";
import { useRouter } from "next/router";
import MenuItem from "@/components/MenuItem";
import AdminWrapper from "@/layout/AdminWrapper";
import Stripe from "stripe";
import ProductInBagCard from "@/components/ProductInBagCard";


const MAX_IMAGES = 5;


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



export default function ChargesPage() {

    const theme = useTheme();
    const router = useRouter();

    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {

        event.defaultMuiPrevented = true

        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const [charges, setCharges] = useState<Stripe.Charge[] | null>(null);
    const [products, setProducts] = useState<StripeProduct[] | null>(null);
    const [categories, setCategories] = useState<Category[] | null>(null);
    const isSm = useMediaQuery("(max-width: 90rem)");
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))


    const columns: GridColDef<Stripe.Charge>[] = [
        {
            field: "amount",
            headerName: "Amount",
            width: 100,
            editable: true,
            renderCell: (params: GridRenderCellParams<Stripe.Charge, number>) => {

                if (!params.value) {
                    return null;
                }

                return (
                    <div className="flex">
                        <Typography sx={{
                            color: theme.palette.primary.light,
                            width: "fit-content",
                            textAlign: "right",
                            lineHeight: "115%",
                            padding: '0.5rem'
                        }}>{formatPrice(params.value, params.row.currency)}</Typography>
                    </div>
                )
            }
        },
        {
            field: "products",
            headerName: "Products",
            width: 500,
            renderCell: (params: GridRenderCellParams<Stripe.Charge, StripeProduct[] | null>) => {

                if (!params.value) {
                    return null;
                }

                return (
                    <div className="column compact">
                        {params.value.map(product => {

                            if (!product) {
                                return null;
                            }

                            return (
                                <ProductInBagCard
                                    key={product.id}
                                    product={product}
                                />
                            )
                        })}
                    </div>
                )
            }
        },
        {
            field: "billing_details",
            headerName: "Billing Details",
            width: 500,
            renderCell: (params: GridRenderCellParams<Stripe.Charge, Stripe.Charge.BillingDetails>) => {

                if (!params.value) {
                    return null;
                }

                return (
                    <div className="column compact">
                        <div className="flex compact">
                            <Typography>Email</Typography>
                            <Typography>{params.value.email}</Typography>
                        </div>
                        <div className="flex compact">
                            <Typography>Address</Typography>
                            <div className="column left snug">
                                <Typography>{params.value.address?.line1}</Typography>
                                <Typography>{params.value.address?.line2}</Typography>
                                <Typography>{params.value.address?.city}, {params.value.address?.country} {params.value.address?.postal_code}</Typography>
                            </div>
                        </div>
                    </div>
                )
            }
        },

    ];


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
                selectedPrice: product.prices[0],
                inventory: product.inventory || 0,
                limit: product.limit || 0
            })
        }

        setProducts(productList);
    }

    const getCharges = async () => {
        const productsFetch = await fetch(`/api/charges`);

        if (!productsFetch.ok) {
            return;
        }

        const response = await productsFetch.json();

        setCharges(response.charges);
    }


    useEffect(() => {
        getProducts();
        getCharges();
    }, []);



    if (!products || !charges) {
        return <></>
    }

    return (
        <AdminWrapper>
                <div className="flex" style={{
                    width: "100%"
                }}>
                    <DataGrid
                        getRowId={(row) => {
                            return row.id;
                        }}
                        rows={charges}
                        columns={columns}
                        editMode="row"
                        getRowHeight={(params) => {
                            return 200
                        }}
                        checkboxSelection
                        rowModesModel={rowModesModel}
                        onRowEditStop={handleRowEditStop}
                        onRowSelectionModelChange={newRowSelectionModel => {
                            setRowSelectionModel(newRowSelectionModel);
                        }}
                        rowSelectionModel={rowSelectionModel}
                        // slots={{
                        //     toolbar: () => (
                        //         <EditToolbar
                        //             setProducts={setProducts}
                        //             selected={rowSelectionModel}
                        //             setSelected={setRowSelectionModel}
                        //             handleAdd={handleAdd}
                        //             handleGroup={handleGroup}
                        //             searchValue={searchValue}
                        //             handleSearch={handleSearch}
                        //         />
                        //     )
                        // }}
                        sx={{
                            width: "100%",
                            minWidth: '100%',
                            height: "calc(100vh - 9.5rem)"
                        }}
                        initialState={{
                            filter: {
                                filterModel: {
                                    items: [
                                        {
                                            id: 1,
                                            field: 'categories',
                                            value: 'is',
                                            operator: 'is',
                                        },
                                    ],
                                },
                            },
                        }}
                    />

            </div>
        </AdminWrapper>
    )
}


