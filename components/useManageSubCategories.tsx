"use client"
// import axios from '@/utils/axios';
import {
  Button,
  styled,
  useTheme,
  Modal,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  Typography,
  Drawer,
  IconButton,
  ButtonBase,
  Chip,
} from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import UploadForm from './UploadForm';
import PhotoItem from './PhotoItem';
import { Category } from '@/types';
import DraggableLinkCard from './DraggableLinkCard';
import { AddOutlined, DragHandle } from '@mui/icons-material';

function arrayMove(array: any[], fromIndex: number, toIndex: number) {
  const updatedArray = [...array];
  const [movedItem] = updatedArray.splice(fromIndex, 1); // Remove the item
  updatedArray.splice(toIndex, 0, movedItem); // Insert at the new index
  return updatedArray;
}


export default function useManageSubCategories(
  source: Category,
  categories: Category[] | null, setCategories: Dispatch<SetStateAction<Category[] | null>>, allCategories: Category[], callbacks: {
    onChange: (files: Category[]) => any;
    onSave: (files: Category[]) => any;
    onRemoveAll?: () => any;
  }) {
  const theme = useTheme();
  const [isDragOver, setIsDragOver] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState<Category[] | null>([]);
  const [isUploadPresent, setIsUploadPresent] = useState(false);
  const [hasLinkListOrderChanged, setHasLinkListOrderChanged] = useState(false);
  const [allCats, setAllCats] = useState<Category[] | null>(null);

  const [uploadCount, setUploadCount] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {

    if (allCategories && Array.isArray(allCategories)) {
      const cats = [...allCategories];
      cats.sort((a, b) => a.name.localeCompare(b.name));
      setAllCats(cats);
    }
    setOrder(categories || []);
  }, [categories, allCategories])


  const handleAddedFiles = (newImages: Category[]) => {

    setCategories((prev) => {
      if (!prev) {
        callbacks.onChange(newImages)
        return newImages;
      }

      const newList = [...prev, ...newImages]
      callbacks.onChange(newList)
      return newList;
    })



  }

  const closeDialog = () => {
    if (loading) {
      alert("It's still loading...")
      return;
    }
    setHasLinkListOrderChanged(false);
    setOrder(categories);
    setIsOpen(false);
  };

  const handleDragEnd = (event: any) => {

    try {
      const { active, over } = event;

      if (active.id !== over.id) {
        setHasLinkListOrderChanged(true);
        setOrder((items) => {

          if (!items) return null;
          const oldIndex = items.findIndex(item => item._id === active.id);
          const newIndex = items.findIndex(item => item._id === over.id);

          const newList = arrayMove(items, oldIndex, newIndex);

          callbacks.onChange(newList);
          return newList;
        });
      }
    }
    catch (err) {
      console.log("Drag-n-drop failed.");
    }

    return;
  }


  const handleRemoveFile = async (uuid: string) => {

    setCategories((prev) => {
      if (!prev) return null;
      const newList = prev.filter((file) => file._id != uuid);
      if (callbacks.onChange) {
        callbacks.onChange(newList);
      }
      return newList;
    })

  }

  const openDialog = () => {
    setIsOpen(true);
  };

  const handleDragOver = (e: { preventDefault: () => void; stopPropagation: () => void }) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };


  const MAX_IMAGES = 10;


  const FileUploadDialog = (
    <>
      <Drawer
        anchor='right'
        open={isOpen}
        onClose={() => {
          closeDialog();
        }}
        keepMounted
      >
        <Paper
          sx={{
            position: 'relative',
            width: "30rem",
            maxWidth: "100%",
            padding: '1rem',
            height: 'fit-content',
            maxHeight: '90vh',
            borderRadius: '0.5rem',
          }}
        >
          <div className="column relaxed"
            style={{
              padding: '1rem 0.5rem 0 0',
              width: "100%",
            }}>
            <div className="column snug">
              <Typography component="h6">Organize</Typography>
              <DndContext
                key={'cat_reorder'}
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                autoScroll={false}
              >
                <SortableContext
                  items={order ? order.map(x => {
                    return { id: x._id }
                  }) : []}
                >
                  {order && order.map((cat) => (
                    <DraggableLinkCard
                      key={cat._id}
                      id={cat._id}
                      item={cat}
                      onDelete={() => {
                        handleRemoveFile(cat._id)
                      }}
                      onClick={() => {
                        return;
                      }}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>

            {categories && (
              <div className="flex right">
                <Button
                  variant='contained'
                  onClick={() => callbacks.onSave(categories)}
                  sx={{
                    height: "2rem"
                  }}
                >Save</Button>
              </div>
            )}

            <Typography component="h6">Add a Category</Typography>
            <div className="column snug" style={{
              borderTop: "1px solid black"
            }}>
              {allCats && allCats.map((cat, i) => {

                if (cat._id === source._id) {
                  return <></>
                }

                if (cat.type === 'tag') {
                  return <></>
                }

                if (categories?.some(c => c._id === cat._id)) {
                  return <></>
                }

                return (
                  <ButtonBase className="flex between" key={cat._id}

                    sx={{
                      width: "100%",
                      padding: "0.25rem",
                      height: "3rem",
                      borderBottom: "1px solid black",
                    }}

                    onClick={() => {

                      const newList = categories ? [...categories, cat] : [cat];
                      callbacks.onChange(newList);
                      setCategories(newList)
                    }}>
                    <div className="flex compact left">
                      <AddOutlined />
                      <Typography>{cat.name}</Typography>
                    </div>
                    {cat.type && (
                      <Chip sx={{
                        fontSize: "1rem",
                        textTransform: 'uppercase'
                      }} label={cat.type.charAt(0)} />
                    )}
                  </ButtonBase>
                )
              })}
            </div>

            <>
              {loading && (
                <div className="flex center middle">
                  <CircularProgress color="primary" />
                </div>
              )}
            </>
          </div>
        </Paper>
      </Drawer>
    </>
  );

  return {
    FileUpload: FileUploadDialog,
    openDialog,
    isUploadPresent,
    isFileUploadOpen: isOpen,
    uploadCount
  };
}
