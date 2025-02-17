import { Button } from "@mui/material";
import { useState, useEffect } from "react";

const ScrollButton = ({ children, onClick, threshold = null, scrollPercentage = 1, flipped = false, ...props }: any) => {
  const [showButton, setShowButton] = useState(flipped);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setShowButton(flipped ? scrollY <= (threshold || document.documentElement.clientHeight * scrollPercentage) : scrollY > (threshold || document.documentElement.clientHeight * scrollPercentage));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {showButton && (
        <>
          {children}
        </>
      )}
    </div>
  );
};

export default ScrollButton;
