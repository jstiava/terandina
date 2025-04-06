"use client"
// import axios from '@/utils/axios';
import {
  Button,
  CircularProgress,
  LinearProgress,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useUploadThing } from '@/utils/uploadthing';
import { UploadType } from './useComplexFileDrop';

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

export default function UploadForm({onAdd} : {onAdd : (newImages : UploadType[]) => any}) {
  const theme = useTheme();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const startProgress = () => {
    setUploadProgress(10);
  }

  const UploadThing = useUploadThing('imageUploader', {
    onUploadProgress: (progress) => {
      const value = Math.round(progress * 1);
      if (value <= 95) {
        startProgress();
      }
      else {
        setUploadProgress(null);
      }

    },
    onClientUploadComplete: (res) => {
      if (res) {

        console.log({
          message: "Upload complete",
          res
        })

        try {
          const uploadedFiles = res.map(file => ({
            ...file.serverData,
            url: file.serverData.small,
            size: file.size,
            isLocal: false
          }))

          onAdd(uploadedFiles);
        }
        catch (err) {
          console.log(err)
        }

      }
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
    },

  })

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isUploadPresent, setIsUploadPresent] = useState(false);

  const [uploadCount, setUploadCount] = useState(0);



  const closeDialog = () => {
    if (loading) {
      alert("It's still loading...")
      return;
    }
    setIsOpen(false);
  };

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


    if (files.length > 0) {
      setLoading(true);
      UploadThing.startUpload(files);
    }
  };


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addImage(e.dataTransfer.files);
    }
  };

  return (
    <div className='column'>
      {uploadProgress && (
        <CircularProgress size={"2rem"}/>
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

}
