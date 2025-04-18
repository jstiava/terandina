
import DarkroomIcon from '@/icons/Darkroom';
import { JSX } from '@emotion/react/jsx-runtime';
import { ButtonBase, Link, Typography, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';

interface CoverImageProps {
  url: string;
  height: string;
  width: string;
  style?: any;
  children?: any;
  className?: string;
  delay?: number;
  recursive?: boolean;
  caption?: string | null;
  caption_link?: string | null;
}

export default function CoverImage({ className = "", url, height, width, style = {}, children = null, delay = 0, recursive = false, caption = null, caption_link = null }: CoverImageProps) {
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
      <div
        className="flex center middle"
        style={{
          width: width,
          height: height,
          backgroundColor: "#ffffff",
          backgroundPosition: 'center',
          opacity: 1,
          transform: 'scale(1)',
          transition: `opacity 0.5s ease-in-out ${delay}s`,
          ...style,
        }}
      >
        <CoverImage
          url="/light_bird.png"
          height={"2.5rem"}
          width={"5rem"}
          recursive
        />
      </div>
    )

  }

  return (
    <div 
      key="loaded"
    className="column snug left"
      style={{
        width: width,
        height: height,
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'scale(1)' : 'scale(0.5)',
        transition: `opacity 0.5s ease-in-out ${delay}s
     transform 3s ease-in-out 0.5s
    `,
        ...style,
      }}>
      <div
        className={`${className}`}
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: style.backgroundImage ? 'unset' : `url(${url})`,
          backgroundColor: style.backgroundImage ? "#ffffff00" : "#ffffff",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >{children}</div>
      {caption && (

        <ButtonBase className="flex compact fit"
        sx={{
          padding: "0.25rem"
        }}
          href={caption_link || ""}
          onClick={(e) => {
            e.preventDefault();
            window.open(caption_link || "/", '_blank')
          }}
        >
          <DarkroomIcon sx={{
            width: "0.5em",
            height: "0.5em"
          }} />
          <Typography sx={{
            fontSize: '0.75rem'
          }}>
            {caption}
          </Typography>
        </ButtonBase>
      )}
    </div>
  );
}
