import { Box } from "@radix-ui/themes";
import React from "react";
import { IconProps } from "@/app/shared/types/iconProps.type";

export const MaximizeIcon = ({
  className,
  width,
  height,
  color,
  onClick,
}: IconProps) => {
  return (
    <Box className={className} onClick={onClick}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 10L21 3M21 3H15M21 3V9M10 14L3 21M3 21H9M3 21L3 15"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
};
