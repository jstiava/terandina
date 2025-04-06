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

function arrayMove(array: any[], fromIndex: number, toIndex: number) {
  const updatedArray = [...array];
  const [movedItem] = updatedArray.splice(fromIndex, 1); // Remove the item
  updatedArray.splice(toIndex, 0, movedItem); // Insert at the new index
  return updatedArray;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipurl: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const MEDIA_BASE_URI = 'https://mozi-belong-media-public-demo.s3.us-east-2.amazonaws.com';
interface FileUploadProps {
  instructions: string;
}

export type UploadType = {
  url: string;
  small?: string | null;
  medium?: string | null;
  large?: string | null;
  size?: number;
  isLocal: boolean;

}

export default function useComplexFileDrop(uploads: UploadType[] | null, setUploads: Dispatch<SetStateAction<UploadType[] | null>>, callbacks: {
  onChange: (files: UploadType[]) => any,
  onRemoveAll?: () => any
}) {
  const theme = useTheme();
  const [isDragOver, setIsDragOver] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState<UploadType[] | null>(null);
  const [isUploadPresent, setIsUploadPresent] = useState(false);
  const [hasLinkListOrderChanged, setHasLinkListOrderChanged] = useState(false);

  const [uploadCount, setUploadCount] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setOrder(uploads);
  }, [uploads])


  const handleAddedFiles = (newImages: UploadType[]) => {

    setUploads((prev) => {
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
    setOrder(uploads);
    setIsOpen(false);
  };

  const handleDragEnd = (event: any) => {

    const { active, over } = event;

    try {
      const { active, over } = event;

      if (active.id !== over.id) {
        setHasLinkListOrderChanged(true);
        setOrder((items) => {

          if (!items) return null;
          const oldIndex = items.findIndex(item => item.url === active.id);
          const newIndex = items.findIndex(item => item.url === over.id);

          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
    catch (err) {
      console.log("Drag-n-drop failed.");
    }

    return;
  }


  const handleRemoveFile = async (uuid: string, isLocal: boolean) => {

    setUploads((prev) => {
      if (!prev) return null;
      const newList = prev.filter((file) => file.url != uuid);
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
      <Modal
        open={isOpen}
        onClose={() => {
          closeDialog();
        }}
        keepMounted
        sx={{ zIndex: 10 }}
      >
        <Paper
          tabIndex={-1}
          sx={{
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            maxWidth: "32rem",
            padding: '1rem',
            height: 'fit-content',
            maxHeight: '90vh',
            borderRadius: '0.5rem',
            overflowX: 'hidden',
            overflowY: 'scroll',
          }}
        >
          <div className="column">
            <div className="flex compact" style={{ alignItems: "flex-start", height: 'fit-content', padding: '1rem 0.5rem 0 0', width: "100%", flexWrap: 'wrap' }}>
              <DndContext
                key={'photo_reorder'}
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                autoScroll={false}
              >
                <SortableContext
                  items={order ? order.map(x => {
                    return { id: x.url }
                  }) : []}
                >
                  {order && order.map((upload) => (
                    <PhotoItem
                      key={upload.url}
                      id={upload.url}
                      upload={upload}
                      handleRemoveFile={handleRemoveFile}
                    />
                  ))}

                </SortableContext>
              </DndContext>
            </div>

            {isOpen && (
              <UploadForm
                onAdd={handleAddedFiles}
              />
            )}
          </div>
          <div
            className="flex between"
            style={{
              position: 'sticky',
              bottom: 0,
              padding: '0.5rem 0 0 0',
              zIndex: '1000',
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <div className="flex compact fit">

            <Button
              variant="text"
              onClick={e => {
                closeDialog();
              }}
              >
              Cancel
            </Button>
            <Button
              color="error"
              variant="text"
              onClick={e => {
                e.stopPropagation();
                setUploads([]);
                if (callbacks.onRemoveAll) {
                  callbacks.onRemoveAll();
                }
              }}
              >
              Remove All
            </Button>
              </div>

            {order && hasLinkListOrderChanged && (
                <Button
                  variant="contained"
                  sx={{
                    height: "2.5rem"
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    setUploads(order);
                    callbacks.onChange(order);
                    setHasLinkListOrderChanged(false);
                  }}
                >
                  Save Order
                </Button>
            )}
          </div>
        </Paper>
      </Modal>
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
