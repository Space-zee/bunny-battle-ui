import { useState, useEffect } from "react";
import debounce from "lodash.debounce";

export enum ScreenSizes {
  xs = 480,
  sm = 768,
  md = 1024,
  lg = 1300,
  xl = 1500,
  xxl = 1800,
}

interface ScreenSizeInterface {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  xxl: boolean;
}

export const useWindowSize = (): ScreenSizeInterface => {
  if (typeof window === "undefined") {
    return {
      xs: false,
      sm: false,
      md: false,
      lg: false,
      xl: false,
      xxl: false,
    };
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const debounceResize = debounce(() => {
      setWindowSize(window.innerWidth);
    }, 100);

    window.addEventListener("resize", debounceResize);
    return () => window.removeEventListener("resize", debounceResize);
  }, []);
  return {
    xs: windowSize < ScreenSizes.xs,
    sm: windowSize < ScreenSizes.sm,
    md: windowSize < ScreenSizes.md,
    lg: windowSize < ScreenSizes.lg,
    xl: windowSize < ScreenSizes.xl,
    xxl: windowSize >= ScreenSizes.xxl,
  };
};

export const useWindowWidthNumber = (): number => {
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const debounceResize = debounce(() => {
      setWindowSize(window.innerWidth);
    }, 100);

    window.addEventListener("resize", debounceResize);
    return () => window.removeEventListener("resize", debounceResize);
  }, []);
  return windowSize;
};
