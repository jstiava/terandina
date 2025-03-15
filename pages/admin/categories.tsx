"use client"
import { headerHeight } from "@/layout/AuthProvider";
import { Category, StripeAppProps, StripeProduct } from "@/types";
import { AddOutlined, CloseOutlined, DeleteOutline, EditOutlined, OpenInNew, RefreshOutlined, TurnLeftOutlined } from "@mui/icons-material";
import { Button, Chip, IconButton, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridFilterModel, GridRenderCellParams, GridRowSelectionModel, GridToolbarContainer } from "@mui/x-data-grid";
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

    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);


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
                return params.value === 'variant' ? "Variant" : "Collection"
            }
        },
        {
            field: "parent_id",
            headerName: "Parent",
            width: 150,
            renderCell: (params: GridRenderCellParams<Category, string>) => {

                const category = params.value ? categories?.find(x => x._id === params.value) : null;

                if (params.row.type === 'segment') {
                    return null;
                }

                if (!category) {
                    return (
                        <Chip
                            avatar={<AddOutlined fontSize="small" />}
                            size="small"
                            key={'add'}
                            label={"Link to page"}
                            sx={{
                                marginBottom: "0.25rem",
                                overflow: 'hidden'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                return;
                            }}
                        />
                    )
                }

                return (
                    <Chip
                        avatar={<TurnLeftOutlined fontSize="small" />}
                        size="small"
                        key={category?._id}
                        label={category.name}
                        sx={{
                            marginBottom: "0.25rem",
                            overflow: 'hidden'
                        }}
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
                            columns={columns}
                            editMode="row"
                            checkboxSelection
                            filterModel={filterModel}
                            onFilterModelChange={setFilterModel}
                            // rowModesModel={rowModesModel}
                            // onRowModesModelChange={handleRowModesModelChange}
                            // onRowEditStop={handleRowEditStop}
                            // processRowUpdate={processRowUpdate}
                            // onRowSelectionModelChange={newRowSelectionModel => {
                            //     setRowSelectionModel(newRowSelectionModel);
                            // }}
                            // rowSelectionModel={rowSelectionModel}
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