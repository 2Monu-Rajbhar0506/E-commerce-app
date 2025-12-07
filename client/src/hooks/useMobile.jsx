/*import React,{useState, useEffect} from 'react'

const useMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

    const handleResize = () => {
        const checkpoint = window.innerWidth < breakpoint;
        setIsMobile(checkpoint)
    }

    useEffect(() => {
      handleResize();

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    return [isMobile];
}

export default useMobile*/


import { useState, useEffect } from "react";

const useMobile = (breakpoint = 768) => {
  const getStatus = () =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false;

  const [isMobile, setIsMobile] = useState(getStatus);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(getStatus());
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};

export default useMobile;


 