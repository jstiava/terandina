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
} from '@mui/material';
import React, { useCallback, useRef, useState, useEffect, ChangeEvent, SetStateAction, MouseEvent, Dispatch } from 'react';
import { Portrait, ImageOutlined, Remove, SwapHoriz, AddPhotoAlternate, Delete, Update } from '@mui/icons-material';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { VariantProductStub } from '@/types';
import { useUploadThing } from '@/utils/uploadthing';
import { isLocale } from 'validator';

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

export default function useComplexFileDrop(presets: string[] | null, uploads: UploadType[], setUploads: Dispatch<SetStateAction<UploadType[]>>, callbacks: {
  onInsert?: any
  onDelete?: any,
  onClear?: any
}) {
  const theme = useTheme();
  const [isDragOver, setIsDragOver] = useState(false);


  const [uploadCount, setUploadCount] = useState(0);

  useEffect(() => {
    setUploadCount(uploads.length);
  }, [uploads]);

  useEffect(() => {
    if (!presets || presets.length === 0) return;

    setIsUploadPresent(true);

    let theUploads = uploads;

    presets.forEach((file) => {

      if (theUploads.some(x => x.url === file)) {
        return;
      }
      theUploads.push({
        url: file,
        isLocal: false
      })
    });


    setUploads(theUploads);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [isOpen, setIsOpen] = useState(false);
  const [isUploadPresent, setIsUploadPresent] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
  };


  const handleRemoveFile = async (uuid: string, isLocal: boolean) => {
    
    setUploads((prev) => {
      const newList = prev.filter((file) => file.url != uuid);
      if (callbacks.onDelete) {
        callbacks.onDelete();
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



  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
      if (res) {

        const uploadedFiles = res.map(file => ({
          url: file.ufsUrl,
          size: file.size,
          isLocal: false
        }))

        setUploads(prev => {
          if (!prev) {
            callbacks.onInsert(uploadedFiles);
            return uploadedFiles
          }
          callbacks.onInsert([...prev, ...uploadedFiles]);
          return [...prev, ...uploadedFiles]
        })
      }
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
    },
  })

  const MAX_IMAGES = 10;

  const addImage = (input: React.ChangeEvent<HTMLInputElement> | FileList) => {
    let files: File[] = [];

    // Handle input from file input event
    if ("target" in input && input.target.files) {
      files = Array.from(input.target.files);
    }
    // Handle input from drag-and-drop
    else if (input instanceof FileList) {
      files = Array.from(input);
    }

    const remainingSlots = MAX_IMAGES - uploads.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (filesToUpload.length > 0) {
      startUpload(filesToUpload);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addImage(e.dataTransfer.files); // ✅ Now works correctly
    }
  };



  const FileUploadForm = (
    <div className='column'>
      {uploads[0] && (
        <div className="column" style={{ alignItems: "flex-start", height: 'fit-content', padding: '1rem 0.5rem 0 0', width: "100%" }}>
          <>
            {uploads && uploads.map((upload) => (
              <div className='flex between' key={upload.url} style={{ width: "100%", position: "relative" }}>
                <div className="flex compact">
                <div style={{
                    width: '8rem',
                    height: '5rem',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '0.5rem',
                    backgroundImage: upload ? `url(${upload.url})` : '',
                  } }></div>
                <div className='column compact' style={{ width: "calc(100% - 9rem)" }}>
                  <Typography component="p" fontSize="0.75rem" style={{ fontWeight: 700, overflowWrap: "break-word", width: "100%" }}>{upload.url}</Typography>
                  {upload.size && <Typography component="span" fontSize="0.75rem">{(upload.size / 1024).toFixed(2)} kb</Typography>}
                </div>
                </div>
                <div style={{ position: "absolute", right: 0, backgroundColor: lighten(theme.palette.background.paper, 0.05), height: "100%" }}>
                  <IconButton>
                    <Delete onClick={() => handleRemoveFile(upload.url, upload.isLocal)} />
                  </IconButton>
                </div>
              </div>
            ))}
          </>
        </div>
      )}
      <div
        className={`visual-drop-area ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={e => {
          handleDrop(e);
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: 'fit-content',
          padding: '2rem',
          justifyContent: 'center',
          alignItems: 'center',
          border: `2px dashed ${theme.palette.divider}`,
          borderRadius: '0.5rem',
        }}
      >
        <>
          <Typography component="p" style={{ fontWeight: 'bold', padding: 0 }}>
            Drop image here.
          </Typography>
          <Typography variant="caption" style={{ padding: 0 }}>Accepted: jpg, png, webp</Typography>
          <Button onClick={e => {
            e.stopPropagation()
          }} component="label" variant="outlined" sx={{ width: '100%', marginTop: '1rem' }}>
            Upload file
            <VisuallyHiddenInput
              type="file"
              multiple
              onChange={addImage}
              accept={'*'}
            />
          </Button>
        </>
      </div>
    </div>
  );




  const FilePreview = (
    <div className="flex" style={{ position: "relative" }}>
      {uploads[0] && (
        <div className="flex compact" style={{ alignItems: "flex-start", height: 'fit-content', width: "100%", }}>
          {uploads && uploads.map((upload, index) => (
            <ButtonBase
              key={upload.url}
              onClick={(e) => {
                openDialog();
              }}
              sx={{
                width: '8rem',
                height: '5rem',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: '0.5rem',
                backgroundImage: upload ? `url(${upload.url})` : '',
              }}
            ></ButtonBase>
          ))}
        </div>
      )}
    </div>
  );

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
            width: '30rem',
            padding: '1rem',
            height: 'fit-content',
            maxHeight: '90vh',
            borderRadius: '0.5rem',
            overflowX: 'hidden',
            overflowY: 'scroll',
          }}
          onClick={() => closeDialog()}
        >
          {isOpen && FileUploadForm}
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
                setUploads([]);
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
    FilePreview,
    openDialog,
    isUploadPresent,
    isFileUploadOpen: isOpen,
    uploadCount
  };
}
