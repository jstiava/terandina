
import { JSX } from '@emotion/react/jsx-runtime';
import { useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import CoverImage from './CoverImage';

interface CoverImageProps {
  url: string;
  height: string;
  width: string;
  style?: any;
  children?: any;
  className?: string;
  delay?: number;
  recursive?: boolean
}

export default function CategoryHeader({ className = "", url, height, width, style = {}, children = null, delay = 0, recursive = false }: CoverImageProps) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const theme = useTheme();

  useEffect(() => {
    const img = new Image();
    img.src = url;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(false);
  }, [url]);

  if (!recursive && !isLoaded) {
    return (
      <CoverImage
        className={`${className}`}
        url="/light_bird.png"
        height={width}
        width={height}
        style={{
          backgroundColor: "#ffffff",
          color: "#3d3d3d",
          width: "100%",
          opacity: 1,
          transform: 'scale(1)',
          transition: `opacity 0.5s ease-in-out ${delay}s`,
          ...style,
        }}
        recursive
      >
        {children}
      </CoverImage>
    )

  }

  return (
    <div
      className={`${className}`}
      style={{
        width: width,
        height: height,
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${url})`,
        backgroundColor: "#ffffff",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'scale(1)' : 'scale(0.5)',
        transition: `opacity 0.5s ease-in-out ${delay}s
         transform 3s ease-in-out 0.5s
        `,
        ...style,
      }}
    >{children}</div>
  );
}
