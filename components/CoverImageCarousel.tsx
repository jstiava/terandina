
import { IconButton, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import CoverImage from './CoverImage';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface CoverImageCarouselProps {
  images: string[];
  height: string;
  width: string;
  isHovering: boolean;
  style?: any;
}

export default function CoverImageCarousel({ images, height, width, isHovering = false, style = {} }: CoverImageCarouselProps) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [active, setActive] = useState(0);

  const theme = useTheme();

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
       onClick={() => setActive(prev => {
        const newIndex = prev - 1;
        return newIndex === -1 ? 0 : newIndex
      })}
       sx={{
        position: 'absolute',
        left: "1rem",
        bottom: "9rem",
        border: `1px solid ${theme.palette.text.primary}`
      }}>
        <ChevronLeft />
      </IconButton>
      <IconButton 
        onClick={() => setActive(prev => {
          const newIndex = prev + 1;
          return newIndex === images.length ? 0 : newIndex
        })}
      sx={{
        position: 'absolute',
        right: "1rem",
        bottom: "9rem",
        border: `1px solid ${theme.palette.text.primary}`
      }}>
        <ChevronRight />
      </IconButton>
      </>
     )}
       {(images && images.length >= active) && (
         <CoverImage key={images[active]} url={images[active]} width={width} height={height} />
       )}
    </div>
  );
}
