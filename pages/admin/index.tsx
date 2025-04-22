"use client"
import { headerHeight } from "@/layout/AuthProvider";
import { Category, SizeChart, SIZING_OPTIONS, StripePrice, StripeProduct } from "@/types";
import { Button, ButtonBase, Checkbox, Chip, FormControl, IconButton, InputLabel, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
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
import { formatPrice } from "@/components/ProductCard";
import { UploadType } from "@/components/useComplexFileDrop";
import ManagePhotosField from "@/components/ManagePhotosField";
import { zain_sans_font } from "@/styles/theme";
import { useRouter } from "next/router";
import MenuItem from "@/components/MenuItem";


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

const EditToolbar = ({ setProducts, selected, setSelected, handleAdd, handleGroup, searchValue, handleSearch }: {
    setProducts: Dispatch<SetStateAction<StripeProduct[] | null>>,
    selected: GridRowSelectionModel,
    setSelected: Dispatch<SetStateAction<GridRowSelectionModel>>,
    handleAdd: () => any,
    handleGroup: (name: string, type: 'variant' | 'collection' | 'tag', selected: GridRowSelectionModel) => any,
    searchValue: any,
    handleSearch: any
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
                <div className="flex fit">
                    <Typography className="flex center middle fit" sx={{
                        height: "2rem"
                    }}>Products</Typography>
                    <TextField
                        label="Search"
                        value={searchValue}
                        onChange={(e) => {
                            handleSearch(e.target.value)
                        }}
                        size="small"
                    // sx={{
                    //     height: "1rem"
                    // }}
                    />

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

const ICONS = [
    "ships_from_us",
    "returns",
    "hypoallergenic",
    "indigenous_artisans"
]


export default function AdminPage() {

    const theme = useTheme();
    const router = useRouter();

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
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))


    const handleUpdate = async (newRow: StripeProduct) => {
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

    const handleRevalidateProduct = async (product_id: string) => {

        return await fetch(`/api/revalidate?product_id=${product_id}`, {
            method: "GET",
        })
            .then(res => res.json())
            .then(res => {
                if (!res.product) {
                    setProducts(prev => {
                        if (!prev) {
                            return [res.product]
                        }
                        const theList = prev.filter(x => x.id != product_id);
                        return theList;
                    })
                    return;
                }
                setProducts(prev => {
                    if (!prev) {
                        return [res.product]
                    }
                    const theList = prev.filter(x => x.id != res.product.id);
                    return [...theList, res.product]
                })
            })
            .catch(err => {
                return;
            })

    }

    const handleCreate = async (newRow: StripeProduct): Promise<StripeProduct> => {
        return await fetch(`/api/products`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product: newRow
            })
        })
            .then(res => res.json())
            .then(res => {
                if (!res.product.prices || res.product.prices.length === 0) {
                    return {
                        ...res.product,
                        quantity: 1,
                        selectedPrice: null
                    }
                }
                return {
                    ...res.product,
                    quantity: 1,
                    selectedPrice: res.product.prices[0]
                };
            })
            .catch(err => {
                console.log(err)
                return null;
            })
    }



    const processRowUpdate = async (newRow: GridRowModel<StripeProduct>) => {

        if (newRow.id === 'new') {
            const newProduct = await handleCreate(newRow);
            if (!newProduct) {
                setProducts((prev) => {
                    if (!prev) return null;
                    const newList = prev.filter(x => x.id != 'new');
                    return newList;
                });
            } else {
                setProducts((prev) => {
                    if (!prev) return null;
                    const newList = prev.filter(x => x.id != 'new');
                    newList.push(newProduct);
                    return newList;
                });
            }
            return newRow;
        }

        if (categories && newRow.categories) {
            const cat_ids = newRow.categories.map(cat_name => {
                const category = categories.find(c => c.name === cat_name);
                if (!category) {
                    return null;
                }
                return category._id;
            })
            newRow.categories = cat_ids.filter(x => x != null);
        }

        await handleUpdate(newRow);
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

    const [filterModel, setFilterModel] = useState<GridFilterModel>({
        items: [],
    });

    const handleSearch = (value: string) => {

        const item = {
            id: "name-filter",
            field: "name",
            operator: "contains",
            value: value,
        }

        if (!value || value === "") {
            setFilterModel((prev) => {
                const items = prev.items.filter((i) => i.field !== item.field);
                return { ...prev, items: items };
            });
            setSearchValue("");
            return;
        }

        setSearchValue(value);

        setFilterModel((prev) => {
            const items = prev.items.filter((i) => i.field !== item.field); // Remove existing filter on the same field
            return { ...prev, items: [...items, item] }; // Add new filter
        });
    };

    const customCategoryFilterOperator: GridFilterOperator<any, number>[] = [
        {
            label: 'Is',
            value: 'is',
            getApplyFilterFn: (filterItem: GridFilterItem) => {
                return (params: any) => {
                    if (!filterItem || !filterItem.value) {
                        return true;
                    }

                    for (const cat of filterItem.value) {
                        if (params.some((p: any[]) => p === cat)) {
                            return true;
                        }
                    }
                    return false;
                };
            },
            InputComponent: CategorySelectInput,
            InputComponentProps: { categories }
        },
    ];

    const columns: GridColDef<StripeProduct>[] = [
        {
            field: "images",
            headerName: "Images",
            sortable: false,
            width: 100,
            renderCell: (params: GridRenderCellParams<StripeProduct, string[]>) => <ManagePhotosField
                type="products" key={params.id} params={params} onChange={(uploads) => {
                    const row = products?.find(x => params.id);
                    if (!row) {
                        return;
                    }
                    console.log(row);
                    // processRowUpdate({
                    //     ...row,
                    //     images: uploads
                    // })
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
                        <Typography >{params.value}{!params.row.active && ` (inactive)`}</Typography>
                        <div className="flex compact fit">
                            <Button
                                variant="text"
                                sx={{
                                    height: "2rem"
                                }}
                                onClick={handleEditClick(params.id)}
                                startIcon={
                                    <EditOutlined fontSize="small" />
                                }>Edit</Button>
                            <Button
                                variant="text"
                                sx={{
                                    height: "2rem"
                                }}
                                onClick={e => {
                                    e.stopPropagation();
                                    window.open(`/item/${params.id}`);
                                }}
                                startIcon={
                                    <OpenInNew fontSize="small" />
                                }>View</Button>
                            <ButtonBase
                                style={{
                                    borderRadius: "0.25rem"
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRevalidateProduct(params.id.toString());
                                    return;
                                }}
                            >
                                <div className="flex compact fit" style={{
                                    backgroundColor: '#6860ff',
                                    color: 'white',
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "0.25rem"
                                }}>
                                    <div style={{
                                        backgroundImage: 'url("/stripe-icon.png")',
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        width: "1rem",
                                        height: "1rem",

                                    }}></div>
                                    <Typography sx={{
                                        fontFamily: [zain_sans_font.style.fontFamily, 'sans-serif'].join(',')
                                    }}>Pull</Typography>
                                </div>
                            </ButtonBase>
                        </div>
                    </div>
                )
            }
        },
        {
            field: "categories",
            headerName: "Categories",
            type: 'singleSelect',
            valueOptions: categories?.map(x => x.name),
            width: 300,
            filterable: true,
            editable: true,
            filterOperators: customCategoryFilterOperator,
            valueGetter: (value: string[], row) => {
                if (!categories) {
                    return [];
                }

                if (value && value instanceof Array) {
                    const names = value.map(c_id => {
                        const theFound = categories.find(c => c._id === c_id);
                        if (!theFound) {
                            return null;
                        }
                        return theFound.name;
                    })
                    return names;
                }
                return []
            },
            renderEditCell: (params: GridRenderCellParams<StripeProduct, string[] | null>) => {

                if (!params.value) {
                    return (
                        <div className="flex top" style={{
                            flexWrap: 'wrap',
                            padding: "0.5rem"
                        }}>
                            <Typography>No Categories</Typography>
                        </div>
                    )
                }

                return (
                    <div className="column compact" style={{
                        padding: "0.5rem",
                        height: "100%",
                        overflowY: "scroll",
                        width: "100%"
                    }}>
                        <div className="flex compact2 top" style={{
                            flexWrap: 'wrap',
                        }}>
                            {params.value.map(cat_name => {

                                if (!cat_name) {
                                    return;
                                }

                                const category = categories?.find(c => c.name === cat_name);

                                if (!category) {
                                    return (
                                        <ErrorOutline color="error" key={`${cat_name}_error`} />
                                    )
                                }
                                return (
                                    <Chip
                                        size="small"
                                        key={category._id}
                                        label={category.name}
                                        onDelete={(e) => {
                                            if (!params.value) {
                                                return;
                                            }

                                            const newList = params.value.filter(x => x != category.name)
                                            params.api.setEditCellValue({
                                                id: params.id,
                                                field: params.field,
                                                value: newList
                                            })
                                            console.log(e);
                                        }}
                                        sx={{
                                            marginBottom: "0.25rem",
                                            overflow: 'hidden'
                                        }}
                                    />
                                )
                            })}

                        </div>
                        <Typography variant="h6" sx={{
                            fontSize: "0.75rem",
                            lineHeight: '100%',
                            textTransform: "uppercase"
                        }}>Collections</Typography>
                        <div className="flex compact2 top" style={{
                            flexWrap: 'wrap',
                        }}>
                            {categories && categories.map(category => {

                                if (category.type != 'collection') {
                                    return null;
                                }


                                if (params.value?.some(c_name => c_name === category.name)) {
                                    return null;
                                }

                                return (
                                    <Chip
                                        size="small"
                                        variant="outlined"
                                        key={category._id}
                                        label={category.name}
                                        onClick={(e) => {

                                            if (!params.value) {
                                                return;
                                            }

                                            params.api.setEditCellValue({
                                                id: params.id,
                                                field: params.field,
                                                value: [...params.value, category.name]
                                            })
                                            return;
                                        }}
                                        sx={{
                                            marginBottom: "0.25rem",
                                            overflow: "hidden"
                                        }}
                                    />
                                )
                            })}
                        </div>

                        <Typography variant="h6" sx={{
                            fontSize: "0.75rem",
                            lineHeight: '100%',
                            textTransform: "uppercase"
                        }}>Variants</Typography>
                        <div className="flex compact2 top" style={{
                            flexWrap: 'wrap',
                        }}>
                            {categories && categories.map(category => {

                                if (category.type != 'variant') {
                                    return null;
                                }


                                if (params.value?.some(c_name => c_name === category.name)) {
                                    return null;
                                }

                                return (
                                    <Chip
                                        size="small"
                                        variant="outlined"
                                        key={category._id}
                                        label={category.name}
                                        onClick={(e) => {

                                            if (!params.value) {
                                                return;
                                            }

                                            params.api.setEditCellValue({
                                                id: params.id,
                                                field: params.field,
                                                value: [...params.value, category.name]
                                            })
                                            return;
                                        }}
                                        sx={{
                                            marginBottom: "0.25rem",
                                            overflow: "hidden"
                                        }}
                                    />
                                )
                            })}
                        </div>

                        <Typography variant="h6" sx={{
                            fontSize: "0.75rem",
                            lineHeight: '100%',
                            textTransform: "uppercase"
                        }}>Tags</Typography>
                        <div className="flex compact2 top" style={{
                            flexWrap: 'wrap',
                        }}>
                            {categories && categories.map(tag => {

                                if (tag.type != 'tag') {
                                    return null;
                                }

                                if (params.value?.some(c_name => c_name === tag.name)) {
                                    return null;
                                }

                                return (
                                    <Chip
                                        size="small"
                                        variant="outlined"
                                        key={tag._id}
                                        label={tag.name}
                                        onClick={(e) => {

                                            if (!params.value) {
                                                return;
                                            }

                                            params.api.setEditCellValue({
                                                id: params.id,
                                                field: params.field,
                                                value: [...params.value, tag.name]
                                            })
                                            return;
                                        }}
                                        sx={{
                                            marginBottom: "0.25rem",
                                            overflow: "hidden"
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </div>
                )
            },
            renderCell: (params: GridRenderCellParams<StripeProduct, string[] | null>) => {

                if (!params.value) {
                    return (
                        <div className="flex top" style={{
                            flexWrap: 'wrap',
                            padding: "0.5rem"
                        }}>
                            <Typography>No Categories</Typography>
                        </div>
                    )
                }

                return (
                    <div className="flex compact2 top" style={{
                        flexWrap: 'wrap',
                        padding: "0.5rem"
                    }}>
                        {params.value.map(cat_name => {

                            if (!cat_name) {
                                return;
                            }

                            const category = categories?.find(c => c.name === cat_name);

                            if (!category) {
                                return (
                                    <ErrorOutline color="error" key={`${cat_name}_error`} />
                                )
                            }
                            return (
                                <Chip
                                    size="small"
                                    key={category._id}
                                    label={category.name}
                                    sx={{
                                        marginBottom: "0.25rem",
                                        overflow: 'hidden'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        params.api.setFilterModel({
                                            items: [{ field: 'categories', operator: 'is', value: [category.name] }]
                                        })
                                    }}
                                />
                            )
                        })}
                        <Chip
                            size="small"
                            key="create"
                            label="Add Category"
                            variant="outlined"
                            onClick={handleEditClick(params.id)}
                            sx={{
                                marginBottom: "0.25rem",
                                overflow: 'hidden'
                            }}
                        />
                    </div>
                )
            }
        },

        {
            field: "icons",
            headerName: "Icons",
            width: 300,
            editable: true,
            renderEditCell: (params: GridRenderCellParams<StripeProduct, string[] | undefined>) => {

                return (
                    <div className="column compact" style={{
                        padding: "0.5rem",
                        height: "100%",
                        overflowY: "scroll",
                        width: "100%"
                    }}>
                        <div className="flex compact2 top" style={{
                            flexWrap: 'wrap',
                        }}>
                            {ICONS.map(icon => {

                                const doesExist = params.value ? params.value.some(x => x === icon) : false;

                                return (
                                    <Chip
                                        size="small"
                                        key={icon}
                                        label={icon}
                                        onDelete={undefined}
                                        onClick={(e) => {

                                            let newList = null;

                                            if (!params.value) {
                                                newList = [icon]
                                            }
                                            else if (!doesExist) {
                                                newList = [...params.value, icon]
                                            }
                                            else {
                                                newList = params.value.filter(x => x != icon);
                                            }

                                            params.api.setEditCellValue({
                                                id: params.id,
                                                field: params.field,
                                                value: newList
                                            });

                                            return;
                                        }}
                                        variant={doesExist ? 'filled' : 'outlined'}
                                        sx={{
                                            marginBottom: "0.25rem",
                                            overflow: 'hidden'
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </div>
                )
            },
            renderCell: (params: GridRenderCellParams<StripeProduct, string[] | undefined>) => {

                if (!params.value) {
                    return null;
                }

                return (
                    <div className="column compact" style={{
                        padding: "0.5rem",
                        height: "100%",
                        overflowY: "scroll",
                        width: "100%"
                    }}>
                        <div className="flex compact2 top" style={{
                            flexWrap: 'wrap',
                        }}>
                            {ICONS.map(icon => {

                                const doesExist = params.value!.some((x) => x === icon);

                                if (!doesExist) {
                                    return;
                                }

                                return (
                                    <Chip
                                        size="small"
                                        key={icon}
                                        label={icon}
                                        onDelete={undefined}
                                        sx={{
                                            marginBottom: "0.25rem",
                                            overflow: 'hidden'
                                        }}
                                    />
                                )
                            })}

                            <Chip
                                size="small"
                                key="create"
                                label="Manage Sizing"
                                variant="outlined"
                                onClick={handleEditClick(params.id)}
                                sx={{
                                    marginBottom: "0.25rem",
                                    overflow: 'hidden'
                                }}
                            />
                        </div>
                    </div>
                )
            }
        },

        {
            field: "sizes",
            headerName: "Sizing",
            width: 300,
            editable: true,
            renderEditCell: (params: GridRenderCellParams<StripeProduct, SizeChart | undefined>) => {


                return (
                    <div className="column compact" style={{
                        padding: "0.5rem",
                        height: "100%",
                        overflowY: "scroll",
                        width: "100%"
                    }}>
                        <div className="flex compact2 top" style={{
                            flexWrap: 'wrap',
                        }}>
                            {SIZING_OPTIONS.map(size => {

                                const marking = params.value && typeof params.value === 'object' ? params.value[size] : null;

                                const doesNotExist = marking === undefined || marking === null;

                                return (
                                    <Chip
                                        size="small"
                                        key={size}
                                        label={size}
                                        onDelete={undefined}
                                        onClick={(e) => {
                                            params.api.setEditCellValue({
                                                id: params.id,
                                                field: params.field,
                                                value: params.value ? {
                                                    ...params.value,
                                                    [size]: doesNotExist ? true : marking ? false : undefined
                                                } : {
                                                    [size]: doesNotExist ? true : marking ? false : undefined
                                                }
                                            })
                                            return;
                                        }}
                                        variant={doesNotExist ? 'outlined' : 'filled'}
                                        color={doesNotExist ? 'error' : marking ? 'success' : 'error'}
                                        sx={{
                                            marginBottom: "0.25rem",
                                            overflow: 'hidden'
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </div>
                )
            },
            renderCell: (params: GridRenderCellParams<StripeProduct, SizeChart | undefined>) => {

                if (!params.value) {
                    return (
                        <div className="flex top" style={{
                            flexWrap: 'wrap',
                            padding: "0.5rem"
                        }}>
                            <Chip
                                size="small"
                                key="create"
                                label="Add Sizing"
                                variant="outlined"
                                onClick={handleEditClick(params.id)}
                                sx={{
                                    marginBottom: "0.25rem",
                                    overflow: 'hidden'
                                }}
                            />
                        </div>
                    )
                }

                return (
                    <div className="column compact" style={{
                        padding: "0.5rem",
                        height: "100%",
                        overflowY: "scroll",
                        width: "100%"
                    }}>
                        <div className="flex compact2 top" style={{
                            flexWrap: 'wrap',
                        }}>
                            {SIZING_OPTIONS.map(size => {

                                const marking = params.value && typeof params.value === 'object' ? params.value[size] : null;

                                const doesNotExist = marking === undefined || marking === null;

                                if (doesNotExist) {
                                    return;
                                }

                                return (
                                    <Chip
                                        size="small"
                                        key={size}
                                        label={size}
                                        onDelete={undefined}
                                        disabled={!marking}
                                        sx={{
                                            marginBottom: "0.25rem",
                                            overflow: 'hidden'
                                        }}
                                    />
                                )
                            })}

                            <Chip
                                size="small"
                                key="create"
                                label="Manage Sizing"
                                variant="outlined"
                                onClick={handleEditClick(params.id)}
                                sx={{
                                    marginBottom: "0.25rem",
                                    overflow: 'hidden'
                                }}
                            />
                        </div>
                    </div>
                )
            }
        },
        {
            field: "description",
            headerName: "Description",
            width: 300,
            editable: true,
            renderEditCell: (params) => {
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
            renderCell: (params: GridRenderCellParams<StripeProduct, string>) => {
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

        {
            field: "details",
            headerName: "Details",
            width: 300,
            editable: true,
            renderEditCell: (params) => {
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
            renderCell: (params: GridRenderCellParams<StripeProduct, string>) => {
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
        {
            field: "sizeNotes",
            headerName: "Notes on size",
            width: 300,
            editable: true,
            renderEditCell: (params) => {
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
            renderCell: (params: GridRenderCellParams<StripeProduct, string>) => {
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
        {
            field: "active",
            headerName: "Active",
            width: 150,
            editable: true,
            filterable: true,
            type: 'boolean',
            renderCell: (params: GridRenderCellParams<StripeProduct, boolean>) => {
                const value = params.value === undefined ? false : params.value;
                return (
                    <Checkbox
                        checked={value}
                        onChange={async (e, checked) => {

                            await processRowUpdate({
                                ...params.row,
                                active: checked
                            })
                        }}
                    />
                )
            }
        },
        {
            field: "is_featured",
            headerName: "Featured",
            filterable: true,
            type: 'boolean',
            width: 75,
            renderCell: (params: GridRenderCellParams<StripeProduct, boolean>) => {

                const value = params.value || false;
                return (
                    <Checkbox
                        checked={value}
                        onChange={async (e, checked) => {

                            await processRowUpdate({
                                ...params.row,
                                is_featured: checked
                            })
                        }}
                    />
                )
            }
        },
        {
            field: "prices",
            headerName: "Price & Quantity",
            width: 400,
            editable: true,
            sortable: false,
            renderEditCell: (params: GridRenderEditCellParams<StripeProduct, StripePrice[]>) => {
                return (
                    <div className="column snug"
                        style={{
                            height: "100%",
                            width: "100%",
                            overflowY: 'scroll',
                            padding: '0.5rem'
                        }}>

                        {params.value && params.value.map(price => (
                            <div className="column snug" key={price.id} style={{
                                width: "100%"
                            }}>
                                <div className="flex fit">
                                    {price.nickname && (<Typography variant="caption" sx={{
                                        padding: 0
                                    }}>{price.nickname}</Typography>)}
                                    {price.unit_amount && (
                                        <Typography>{formatPrice(price.unit_amount * 1, price.currency)}</Typography>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            },
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


    ];


    const handleGroup = async (name: string, type: 'variant' | 'collection' | 'tag', selected: GridRowSelectionModel) => {


        const catRequest = await fetch(`api/categories`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                action: "Group",
                name,
                type,
                products: selected ? Array.isArray(selected) ? selected : [selected] : []
            })
        })
            .then(res => res.json())
            .then(res => {
                setCategories(prev => {
                    if (!prev) {
                        return [res.category]
                    }
                    return [...prev, res.category]
                })

                setProducts(prev => {
                    if (!prev) {
                        return null;
                    }


                    const newList = prev.map(x => {
                        if (selected.some(a => a === x.id)) {
                            return {
                                ...x,
                                categories: x.categories ? [...x.categories, res.category._id] : [res.category._id]
                            }
                        }
                        return x;
                    });

                    return newList;
                })
            })
            .catch(err => {
                throw Error(err);
            })

    }

    const handleAdd = () => {
        const id = 'new';
        setProducts((oldRows) => {
            const newProduct: StripeProduct = {
                id,
                object: "product",
                active: false,
                created: 0,
                default_price: '',
                description: '',
                images: [],
                livemode: false,
                metadata: {},
                name: "",
                package_dimensions: null,
                shippable: null,
                statement_descriptor: null,
                tax_code: null,
                type: "service",
                unit_label: null,
                updated: 0,
                url: null,
                prices: [],
                categories: [],
                related: [],
                is_featured: false,
                selectedPrice: null,
                quantity: 1,
                marketing_features: [],
                media: []
            };


            if (!oldRows) {
                return [newProduct]
            }
            return [...oldRows, newProduct]
        });

        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    }

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
                padding: isMobile ? "1rem 0" : "1rem"
            }}>
            <div className={isSm ? "column left" : "column left"} style={{
                marginTop: headerHeight,
                maxWidth: "120rem",
                padding: isSm ? "0" : "0.5rem",
                width: "100%"
            }}>


                <div className="flex compact">

                    <MenuItem
                        key={'products'}
                        focused
                        onClick={() => {
                            router.push('/admin/products')
                        }}
                        icon={<CheckroomOutlined  />}
                        reverse
                        style={{
                            width: "fit-content",
                            padding: "0 0 0 1rem",
                            backgroundColor: "#00000010"
                        }}
                    >

                        Products
                    </MenuItem>

                    <MenuItem
                        key={'Inventory'}
                        onClick={() => {
                            router.push('/admin/inventory')
                        }}
                        icon={<Inventory2Outlined  />}
                        reverse
                        style={{
                            width: "fit-content",
                            padding: "0 0 0 1rem",
                        }}
                    >

                        Inventory
                    </MenuItem>
                    <MenuItem
                        key={'Categories'}
                        onClick={() => {
                            router.push('/admin/categories')
                        }}
                        icon={<CategoryOutlined />}
                        reverse
                        style={{
                            width: "fit-content",
                            padding: "0 0 0 1rem",
                        }}
                    >

                        Categories
                    </MenuItem>

                </div>

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
                            return Math.max(100, row.prices.length * 45)
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
                        slots={{
                            toolbar: () => (
                                <EditToolbar
                                    setProducts={setProducts}
                                    selected={rowSelectionModel}
                                    setSelected={setRowSelectionModel}
                                    handleAdd={handleAdd}
                                    handleGroup={handleGroup}
                                    searchValue={searchValue}
                                    handleSearch={handleSearch}
                                />
                            )
                        }}
                        sx={{
                            width: "100%",
                            height: "calc(100vh - 9.5rem)"
                        }}
                        filterModel={filterModel}
                        onFilterModelChange={setFilterModel}
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
            </div>
        </div>
    )
}


