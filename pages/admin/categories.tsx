"use client"
import ManagePhotosField from "@/components/ManagePhotosField";
import ManageSubcategories from "@/components/ManageSubcategories";
import { headerHeight } from "@/layout/AuthProvider";
import { Category, StripeAppProps, StripeProduct } from "@/types";
import { AddOutlined, CancelOutlined, CloseOutlined, DeleteOutline, EditOutlined, OpenInNew, RefreshOutlined, SaveOutlined, TurnLeftOutlined } from "@mui/icons-material";
import { Button, Chip, IconButton, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridEventListener, GridFilterModel, GridRenderCellParams, GridRowEditStopReasons, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridRowSelectionModel, GridToolbarContainer } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

const EditToolbar = ({ setCategories, selected, setSelected, handleAdd }: {
    setCategories: Dispatch<SetStateAction<Category[] | null>>,
    selected: GridRowSelectionModel,
    setSelected: Dispatch<SetStateAction<GridRowSelectionModel>>,
    handleAdd?: () => any
}) => {

    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("Name of Group");
    const anchorRef = useRef<any>(null);

    const handleGroupRequest = (e: any) => {
        setOpen(true);
    }

    if (!selected || selected.length === 0) {
        return (
            <GridToolbarContainer className='flex between' sx={{ padding: '0.5rem 0.75rem', backgroundColor: theme.palette.primary.contrastText, color: theme.palette.primary.main }}>
                <div className="flex compact fit">
                    <Typography className="flex center middle fit" sx={{
                        height: "2rem"
                    }}>Categories</Typography>

                </div>
                {handleAdd && (
                    <Button
                        onClick={handleAdd}
                        startIcon={<AddOutlined />}
                        variant="outlined" sx={{
                            height: "2rem"
                        }}>New</Button>
                )}
            </GridToolbarContainer>
        )
    }
    return (
        <>


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

                </div>
                {/* <Button onClick={triggerExportReport}>
            Export
        </Button> */}
            </GridToolbarContainer>


        </>
    )
}


export default function CategoryAdminPage(props: StripeAppProps) {
    const isSm = useMediaQuery("(max-width: 90rem)");
    const router = useRouter();

    const [categories, setCategories] = useState<Category[] | null>(null);
    const [searchValue, setSearchValue] = useState<string>("");
    const [filterModel, setFilterModel] = useState<GridFilterModel>({
        items: [],
    });
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    console.log(categories);

    const handleUpdate = async (newRow: Category) => {
        await fetch(`/api/categories?id=${newRow._id}`, {
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

    const handleCreate = async (newRow: Category): Promise<Category | null> => {

        return null;
        // return await fetch(`/api/products`, {
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         product: newRow
        //     })
        // })
        //     .then(res => res.json())
        //     .then(res => {
        //         if (!res.product.prices || res.product.prices.length === 0) {
        //             return {
        //                 ...res.product,
        //                 quantity: 1,
        //                 selectedPrice: null
        //             }
        //         }
        //         return {
        //             ...res.product,
        //             quantity: 1,
        //             selectedPrice: res.product.prices[0]
        //         };
        //     })
        //     .catch(err => {
        //         console.log(err)
        //         return null;
        //     })
    }

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {

        event.defaultMuiPrevented = true

        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const processRowUpdate = async (newRow: GridRowModel<Category>) => {

        if (newRow._id === 'new') {
            const newProduct = await handleCreate(newRow);
            if (!newProduct) {
                setCategories((prev) => {
                    if (!prev) return null;
                    const newList = prev.filter(x => x._id != 'new');
                    return newList;
                });
            } else {
                setCategories((prev) => {
                    if (!prev) return null;
                    const newList = prev.filter(x => x._id != 'new');
                    newList.push(newProduct);
                    return newList;
                });
            }
            return newRow;
        }

        // if (categories && newRow.categories) {
        //     const cat_ids = newRow.categories.map(cat_name => {
        //         const category = categories.find(c => c.name === cat_name);
        //         if (!category) {
        //             return null;
        //         }
        //         return category._id;
        //     })
        //     newRow.categories = cat_ids.filter(x => x != null);
        // }

        await handleUpdate(newRow);
        setCategories((prev) => {
            if (!prev) return null;
            const newList = prev.map((row) => (row._id === newRow._id ? newRow : row));
            return newList;
        });
        return newRow;
    };





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

    const handleRevalidate = (id: string) => async () => {
        await fetch(`/api/categories?id=${id}&revalidate=${true}`, {
            method: "PATCH"
        })
            .then(res => {

                return;
            })
            .catch(err => {
                console.log(err);
            })
    }

    const handleDelete = (id: string) => async () => {
        await fetch(`/api/categories?id=${id}`, {
            method: "DELETE"
        })
            .then(res => {
                setCategories(prev => {
                    if (!prev) return null;
                    const newList = prev.filter(c => c._id != id)
                    return newList;
                })
                return;
            })
            .catch(err => {
                console.log(err);
            })
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
        getCategories();
    }, []);

    const columns = [
        {
            field: "images",
            headerName: "Images",
            sortable: false,
            width: 100,
            renderCell: (params: GridRenderCellParams<Category, string[]>) => <ManagePhotosField key={params.id} params={params} type="categories" onChange={(uploads) => {
                const row = categories?.find(x => params.id);
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
            renderCell: (params: GridRenderCellParams<Category, string>) => {

                return (
                    <div className="column snug left" style={{
                        padding: "0.5rem"
                    }}
                    >
                        <Typography >{params.value}</Typography>
                        <div className="flex compact fit">
                            {/* <Button
                                variant="text"
                                sx={{
                                    height: "2rem"
                                }}
                                onClick={handleEditClick(params.id)}
                                startIcon={
                                    <EditOutlined fontSize="small" />
                                }>Edit</Button> */}
                            <Button
                                disabled={params.row.type != 'collection'}
                                variant="text"
                                sx={{
                                    height: "2rem"
                                }}
                                onClick={e => {
                                    e.stopPropagation();
                                    window.open(`/${params.row.slug}`);
                                }}
                                startIcon={
                                    <OpenInNew fontSize="small" />
                                }>View</Button>
                            <IconButton
                                onClick={handleDelete(params.id.toString())}
                            >
                                <DeleteOutline />
                            </IconButton>
                            {params.row.type === 'collection' && (
                                <>
                                    <IconButton
                                        onClick={handleRevalidate(params.id.toString())}
                                    >
                                        <RefreshOutlined />
                                    </IconButton>
                                </>
                            )}
                        </div>
                    </div>
                )
            }
        },
        { 
            field: "type",
            headerName: "Type",
            width: 100,
            renderCell: (params: GridRenderCellParams<Category, string>) => {
                return params.value ? (
                    <div className="flex left center" style={{
                        height: "100%"
                    }}>
                        <Typography
                            variant="h6"
                            sx={{
                                textTransform: 'capitalize',
                                fontSize: "1rem",
                                width: "fit-content",
                                textAlign: 'left'
                            }}>{params.value}</Typography>
                    </div>
                ) : <></>
            }
        },
        {
            field: "categories",
            headerName: "Categories",
            width: 100,
            editable: true,
            renderCell: (params: GridRenderCellParams<Category, Category[] | null>) => {

                if (!categories) {
                    return <></>
                }

                return (
                    <ManageSubcategories
                        params={params}
                        onChange={(files) => {
                            console.log(files);
                        }}
                        onSave={(files) => {
                            processRowUpdate({
                                ...params.row,
                                categories: files
                            })
                        }}
                        allCategories={categories}
                    />
                )
                
            }
        },
        {
            field: "description",
            headerName: "Description",
            width: 300,
            editable: true,
            renderEditCell: (params: GridRenderCellParams<Category, string | null>) => {
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
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            getActions: ({ id } : {id : string}) => {
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
                    <TextField
                        label="Search"
                        value={searchValue}
                        onChange={(e) => {
                            handleSearch(e.target.value)
                        }}
                    />
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
                            getRowHeight={(params) => {
                                return 100;
                            }}
                            rows={categories}
                            columns={columns as any}
                            editMode="row"
                            checkboxSelection
                            filterModel={filterModel}
                            onFilterModelChange={setFilterModel}
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
                                        setCategories={setCategories}
                                        selected={rowSelectionModel}
                                        setSelected={setRowSelectionModel}
                                    />
                                )
                            }}
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