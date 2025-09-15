import { useState, useEffect } from "react";

interface ResponsiveBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
}

export const useResponsive = (): ResponsiveBreakpoints => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isMobile: windowSize.width <= 768,
    isTablet: windowSize.width > 768 && windowSize.width <= 1024,
    isDesktop: windowSize.width > 1024,
    width: windowSize.width,
  };
};
