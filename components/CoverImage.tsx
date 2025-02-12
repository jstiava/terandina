
import { JSX } from '@emotion/react/jsx-runtime';
import { useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';

interface CoverImageProps {
  url: string;
  height: string;
  width: string;
  style?: any;
  children?: any;
  className?: string;
  delay?: number;
}

export default function CoverImage({ className = "", url, height, width, style = {}, children = null, delay = 0 }: CoverImageProps) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const theme = useTheme();

  useEffect(() => {
    const img = new Image();
    img.src = url;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(false);
  }, [url]);

  if (!isLoaded) {
    return (
      <div
        style={{
          width: width,
          height: height,
          backgroundColor: theme.palette.primary.main,
          backgroundPosition: 'center',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'scale(1)' : 'scale(0.5)',
          transition: `opacity 0.5s ease-in-out ${delay}s`,
          ...style,
        }}
      />
    )

  }

  return (
    <div
      className={`${className}`}
      style={{
        width: width,
        height: height,
        backgroundImage: `url(${url})`,
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
