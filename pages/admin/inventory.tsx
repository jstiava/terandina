"use client"
import { headerHeight } from "@/layout/AuthProvider";
import { Category, SizeChart, SIZING_OPTIONS, StripePrice, StripeProduct, TerandinaImage } from "@/types";
import { Button, ButtonBase, Checkbox, Chip, FormControl, IconButton, InputLabel, MenuItem, Popover, Select, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
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
import { AddOutlined, ArchiveOutlined, CancelOutlined, CloseOutlined, DeleteOutlined, EditOutlined, ErrorOutline, GroupWorkOutlined, OpenInNew, RemoveOutlined, SaveOutlined, WarningOutlined } from "@mui/icons-material";
import { formatPrice } from "@/components/ProductCard";
import { UploadType } from "@/components/useComplexFileDrop";
import ManagePhotosField from "@/components/ManagePhotosField";
import { zain_sans_font } from "@/styles/theme";
import CoverImage from "@/components/CoverImage";


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

const EditToolbar = ({ setProducts, selected, setSelected, handleAdd, handleGroup }: {
    setProducts: Dispatch<SetStateAction<StripeProduct[] | null>>,
    selected: GridRowSelectionModel,
    setSelected: Dispatch<SetStateAction<GridRowSelectionModel>>,
    handleAdd: () => any,
    handleGroup: (name: string, type: 'variant' | 'collection' | 'tag', selected: GridRowSelectionModel) => any
}) => {

    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const anchorRef = useRef<any>(null);

    const handleGroupRequest = (e: any) => {
        setOpen(true);
    }

    const handleDelete = async () => {

        const deleteRequest = await fetch(`api/products`, {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                products: selected ? Array.isArray(selected) ? selected : [selected] : []
            })
        })

        if (!deleteRequest.ok) {
            return;
        }

        setProducts(prev => {
            if (!prev) {
                return [];
            }
            let newList = [];
            for (const product of prev) {
                if (!selected.some(x => x === product.id)) {
                    newList.push(product);
                }
                else {
                    newList.push({
                        ...product,
                        active: false
                    })
                }
            }
            return newList;
        })
    }

    if (!selected || selected.length === 0) {
        return (
            <GridToolbarContainer className='flex between' sx={{ padding: '0.5rem 0.75rem', backgroundColor: theme.palette.primary.contrastText, color: theme.palette.primary.main }}>
                <div className="flex compact fit">
                    <Typography className="flex center middle fit" sx={{
                        height: "2rem"
                    }}>Products</Typography>

                </div>
                <Button
                    onClick={handleAdd}
                    startIcon={<AddOutlined />}
                    variant="outlined" sx={{
                        height: "2rem"
                    }}>New</Button>
            </GridToolbarContainer>
        )
    }
    return (
        <>

            <Popover
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                onClose={() => setOpen(false)}
                // transition
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                disablePortal
                sx={{
                    '& .MuiPopover-paper': {
                        width: "25rem",
                        padding: "1rem"
                    }
                }}
            >
                <div className="column compact">
                    <TextField
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name of Group Here"
                    />
                    <div className="flex compact">
                        <Button
                            variant="text"
                            onClick={(e) => {
                                try {
                                    handleGroup(name, 'variant', selected);
                                    setOpen(false)
                                }
                                catch (err) {
                                    console.error(err)
                                    return;
                                }
                            }}
                            sx={{
                                height: "2.5rem"
                            }}
                        >
                            Variants
                        </Button>
                        <Button
                            variant="text"
                            onClick={(e) => {
                                try {
                                    handleGroup(name, 'collection', selected);
                                    setOpen(false)
                                }
                                catch (err) {
                                    console.error(err)
                                    return;
                                }
                            }}
                            sx={{
                                height: "2.5rem"
                            }}
                        >
                            Collection
                        </Button>
                        <Button
                            variant="text"
                            onClick={(e) => {
                                try {
                                    handleGroup(name, 'tag', selected);
                                    setOpen(false)
                                }
                                catch (err) {
                                    console.error(err)
                                    return;
                                }
                            }}
                            sx={{
                                height: "2.5rem"
                            }}
                        >
                            Tag
                        </Button>
                    </div>
                </div>
            </Popover>
            <GridToolbarContainer className='flex between' sx={{ padding: '0.5rem 0.75rem', backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
                {/* <GridToolbarColumnsButton />
  <GridToolbarFilterButton />
  <GridToolbarDensitySelector slotProps={{ tooltip: { title: 'Change density' } }} /> */}
                {/* <Box sx={{ flexGrow: 1 }} /> */}
                <div className="flex compact fit">
                    {selected && (
                        <div className="flex center middle" style={{
                            width: "1.5rem",
                            height: "1.5rem",
                            borderRadius: "100%",
                            backgroundColor: theme.palette.primary.contrastText,
                            color: theme.palette.primary.main
                        }}>{selected.length}</div>
                    )}
                    <Button
                        onClick={() => setSelected([])}
                        startIcon={<CloseOutlined />}
                        variant="contained" sx={{
                            height: "2rem"
                        }}>Unselect All</Button>

                    <Button
                        ref={anchorRef}
                        onClick={handleGroupRequest}
                        startIcon={<GroupWorkOutlined />}
                        variant="contained" sx={{
                            height: "2rem"
                        }}>Group</Button>
                    <Button
                        onClick={handleDelete}
                        startIcon={<ArchiveOutlined />}
                        variant="contained" sx={{
                            height: "2rem"
                        }}>Archive</Button>
                </div>
                {/* <Button onClick={triggerExportReport}>
            Export
        </Button> */}
            </GridToolbarContainer>


        </>
    )
}


const CategorySelectInput = ({ categories, ...props }: { categories: Category[] } & GridFilterInputValueProps) => {


    return (
        <FormControl variant="standard" fullWidth size="small" sx={{
            justifyContent: 'flex-end'
        }}>
            <InputLabel id="demo-simple-select-label">Categories</InputLabel>
            <Select
                size="small"
                multiple
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={props.item.value || []}
                label="Category"
                renderValue={(selected) => selected.join(', ')}
                onChange={(e) => {
                    console.log(props)
                    props.applyValue({ ...props.item, value: e.target.value })
                }}
            >
                {categories.map(cat => (
                    <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}


export default function AdminPage() {

    const theme = useTheme();

    const [images, setImages] = useState<UploadType[]>([]);
    const [newUploads, setNewUploads] = useState<UploadType[]>([]);

    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const [searchValue, setSearchValue] = useState("");

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        event.defaultMuiPrevented = true
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const [products, setProducts] = useState<StripeProduct[] | null>(null);
    const [categories, setCategories] = useState<Category[] | null>(null);
    const isSm = useMediaQuery("(max-width: 90rem)");
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleEditClick = (id: GridRowId) => () => {
        console.log(id);
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

    const handleUpdate = async (newRow: Partial<StripeProduct>) => {
        await fetch(`/api/products?id=${newRow.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(newRow)
        })
            .catch(err => {
                console.log("Error while updating.")
            })
    }

    const processRowUpdate = async (newRow: GridRowModel<any>) => {

        console.log(newRow);

        const newSizing : Partial<SizeChart> = {};
        for (const size of SIZING_OPTIONS) {
            const marking = newRow[size];
            if (marking === "") {
                delete newRow[size];
                continue;
            }
            else if (marking === undefined || marking === null) {
                continue;
            }
            delete newRow[size];
            newSizing[size] = marking;
        }

        const newEntry = {
            ...newRow,
            sizes: newSizing
        }
        await handleUpdate(newEntry);
        setProducts((prev) => {
            if (!prev) return null;
            const newList = prev.map((row) => (row.id === newEntry.id ? newEntry : row));
            return newList;
        });
        return newEntry;
    };


    const generateSizeColumns = (): GridColDef[] => {
        return SIZING_OPTIONS.map((size, i) => ({
            field: size,
            headerName: size,
            width: 60,
            editable: true,
            valueGetter: (value: any, row: StripeProduct) => {

                if (!row.sizes) {
                    return null;
                }
                const marking = row.sizes[size]
                const doesNotExist = marking === undefined || marking === null;
                if (doesNotExist) {
                    return null;
                }
                if (marking === false) {
                    return 0;
                }
                if (marking === true) {
                    return 1;
                }
                return marking;
            },
            renderEditCell: (params: GridRenderCellParams<StripeProduct, number | null>) => {

                if (params.value === null) {
                    return (
                        <Switch
                            value={false}
                            onClick={() => {
                                params.api.setEditCellValue({
                                    id: params.id,
                                    field: params.field,
                                    value: 0
                                })
                            }}
                        />
                    )
                }

                return (
                    <TextField
                        sx={{
                            fontSize: "1rem",
                            opacity: params.value === 0 ? 0.25 : 1
                        }}
                        value={params.value}
                        onChange={(e) => {
                            if (!e.target.value) {
                                params.api.setEditCellValue({
                                    id: params.id,
                                    field: params.field,
                                    value: ""
                                })
                                return;
                            }
                            params.api.setEditCellValue({
                                id: params.id,
                                field: params.field,
                                value: Number(e.target.value)
                            })
                        }}
                    />
                )
            },
            renderCell: (params: GridRenderCellParams<StripeProduct, number | null>) => {

                if (params.value === null) {
                   return null;
                }
                return (
                    <Typography sx={{
                        opacity: params.value === 0 ? 0.25 : 1
                    }}>{params.value}</Typography>
                )
            }
        }))
    }


    const columns: GridColDef<StripeProduct>[] = [
        {
            field: "media",
            headerName: "Image",
            width: 60,
            renderCell: (params: GridRenderCellParams<StripeProduct, TerandinaImage[]>) => {
                if (params.value && params.value.length > 0) {

                    const image = params.value[0];
                    if (!image || !image.small) {
                        return <WarningOutlined
                            color="warning"
                        />
                    }
                    return (
                        <CoverImage
                            url={image.small}
                            height={"3rem"}
                            width={"3rem"}
                        />
                    )
                }
                else {
                    return <WarningOutlined
                        color="warning"
                    />
                }
            }
        },
        {
            field: "name",
            headerName: "Name",
            width: 250,
            editable: true,
            renderCell: (params: GridRenderCellParams<StripeProduct, string>) => {

                return (
                    <div className="column snug left" style={{
                        padding: "0.25rem"
                    }}
                    >
                        <Typography >{params.value}{!params.row.active && ` (inactive)`}</Typography>
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

    const getCategories = async () => {

        const catFetch = await fetch(`/api/categories?doNotCache=true`);

        if (!catFetch.ok) {
            return;
        }

        const response = await catFetch.json();

        setCategories(response.categories);
    }


    useEffect(() => {
        getProducts();
        getCategories();
    }, []);



    if (!products) {
        return <></>
    }

    return (
        <div id="content"
            className="column center"
            style={{
                padding: isMobile ? "1rem 0" : "0rem"
            }}>
            <div className={isSm ? "column left" : "column left"} style={{
                marginTop: headerHeight,
                maxWidth: "120rem",
                padding: isSm ? "0" : "0.5rem",
                width: "100%"
            }}>

                <div className="flex top" style={{
                    width: "100%",
                    position: "fixed",
                    // zIndex: 10,
                    height: "calc(100vh - 5rem)",
                    backgroundColor: theme.palette.background.paper,
                }}>
                    <DataGrid
                        getRowId={(row) => {
                            return row.id;
                        }}
                        rows={products}
                        columns={[...columns, ...generateSizeColumns()]}
                        editMode="row"
                        getRowHeight={(params) => {
                            const row = products.find(x => x.id === params.id)
                            if (!row) return 100;
                            return 50;
                        }}
                        checkboxSelection
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
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
                        //         />
                        //     )
                        // }}
                        sx={{
                            width: "100%",
                            height: "100%"
                        }}
                        // filterModel={filterModel}
                        // onFilterModelChange={setFilterModel}
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

                    >
                    </DataGrid>
                </div>
            </div>
        </div>
    )
}


