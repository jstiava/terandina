import { Button } from "@mui/material";
import { useState, useEffect } from "react";

const ScrollButton = ({children, onClick, ...props} : any) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setShowButton(scrollY > window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {showButton && (
        <Button
        {...props}
          onClick={onClick}
        >
          {children}
        </Button>
      )}
    </div>
  );
};

export default ScrollButton;
