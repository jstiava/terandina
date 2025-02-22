"use client"
// import axios from '@/utils/axios';
import {
  Button,
  IconButton,
  Tooltip,
  Typography,
  styled,
  useTheme,
  lighten,
  Modal,
  Paper,
  ButtonBase,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import React, { useCallback, useRef, useState, useEffect, ChangeEvent, SetStateAction, MouseEvent, Dispatch } from 'react';
import { Portrait, ImageOutlined, Remove, SwapHoriz, AddPhotoAlternate, Delete, Update, DeleteOutlined, DeleteOutline } from '@mui/icons-material';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { VariantProductStub } from '@/types';
import { useUploadThing } from '@/utils/uploadthing';
import { isLocale } from 'validator';
import UploadForm from './UploadForm';

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
  const [isUploadPresent, setIsUploadPresent] = useState(false);

  const [uploadCount, setUploadCount] = useState(0);


  const handleAddedFiles = (newImages : UploadType[]) => {

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
    setIsOpen(false);
  };


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
          onClick={() => closeDialog()}
        >
          <div className="column">
            <div className="flex compact" style={{ alignItems: "flex-start", height: 'fit-content', padding: '1rem 0.5rem 0 0', width: "100%", flexWrap: 'wrap' }}>
              <>
                {uploads && uploads.map((upload) => (
                  <div className='column compact left'
                    key={upload.url}
                    style={{
                      width: "9rem",
                      position: "relative",
                      marginBottom: "0.5rem"
                    }}>
                    <div className="column compact">
                      <div style={{
                        width: '9rem',
                        height: '9rem',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        borderRadius: '0.5rem',
                        backgroundImage: upload ? `url(${upload.url})` : '',
                      }}>
                        <IconButton sx={{
                          position: "absolute",
                          top: "-1rem",
                          left: "-1rem",
                          backgroundColor: theme.palette.background.paper,
                          color: theme.palette.error.main,
                          border: `1px solid ${theme.palette.divider}`,
                          '&:hover': {
                            backgroundColor: `${theme.palette.divider} !important`
                          }
                        }}>
                          <DeleteOutline onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(upload.url, upload.isLocal)
                          }} />
                        </IconButton>

                      </div>
                    </div>
                  </div>
                ))}

                <>
                  {loading && (
                    <div className="flex center middle">
                      <CircularProgress color="primary" />
                    </div>
                  )}
                </>
              </>
            </div>
            {isOpen && (
              <UploadForm
                onAdd={handleAddedFiles}
              />
            )}
          </div>
          <div
            className="flex compact"
            style={{
              position: 'sticky',
              bottom: 0,
              padding: '0.5rem 0 0 0',
              zIndex: '1000',
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
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
