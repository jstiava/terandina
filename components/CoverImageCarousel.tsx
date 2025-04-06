
import { IconButton, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import CoverImage from './CoverImage';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { TerandinaImage } from '@/types';

interface CoverImageCarouselProps {
  images: TerandinaImage[];
  height: string;
  width: string;
  isHovering: boolean;
  style?: any;
}

export default function CoverImageCarousel({ images, height, width, isHovering = false, style = {} }: CoverImageCarouselProps) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [active, setActive] = useState(0);

  const theme = useTheme();


  try {


    return (
      <div
        style={{
          position: 'relative',
          width: width,
          height: height,
          ...style
        }}

      >
        {isHovering && images.length > 1 && (
          <>
            <IconButton
              href=""
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActive(prev => {
                  const newIndex = prev - 1;
                  return newIndex === -1 ? 0 : newIndex
                })
              }}
              sx={{
                position: 'absolute',
                right: "4rem",
                top: "1rem",
                border: `1px solid ${theme.palette.text.primary}`,
                zIndex: 10
              }}>
              <ChevronLeft />
            </IconButton>
            <IconButton
              href=""
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActive(prev => {
                  const newIndex = prev + 1;
                  return newIndex === images.length ? 0 : newIndex
                })
              }}
              sx={{
                position: 'absolute',
                right: "1rem",
                top: "1rem",
                border: `1px solid ${theme.palette.text.primary}`,
                zIndex: 10
              }}>
              <ChevronRight />
            </IconButton>
          </>
        )}
        {(images && images.length >= active + 1) && (
          <CoverImage key={images[active].medium} url={images[active].medium || ''} width={width} height={height} />
        )}
      </div>
    );

  }
  catch (err) {
    return null;
  }
}
