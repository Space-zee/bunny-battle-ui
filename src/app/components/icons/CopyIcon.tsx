import { Box } from "@radix-ui/themes";
import React from "react";
import { IconProps } from "@/app/shared/types/iconProps.type";

export const CopyIcon = ({
  className,
  width,
  height,
  color = "#E478FA",
}: IconProps) => {
  return (
    <Box className={className}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1345_1061)">
          <path
            d="M8.75008 1.66899C8.18754 1.67661 7.84983 1.70918 7.57676 1.84831C7.26316 2.0081 7.00819 2.26307 6.8484 2.57667C6.70927 2.84974 6.6767 3.18745 6.66908 3.74999M16.2501 1.66899C16.8126 1.67661 17.1503 1.70918 17.4234 1.84831C17.737 2.0081 17.992 2.26307 18.1518 2.57667C18.2909 2.84974 18.3235 3.18744 18.3311 3.74998M18.3311 11.25C18.3235 11.8125 18.2909 12.1502 18.1518 12.4233C17.992 12.7369 17.737 12.9919 17.4234 13.1517C17.1503 13.2908 16.8126 13.3234 16.2501 13.331M18.3334 6.66665V8.33332M11.6668 1.66666H13.3334M4.33341 18.3333H10.6667C11.6002 18.3333 12.0669 18.3333 12.4234 18.1517C12.737 17.9919 12.992 17.7369 13.1518 17.4233C13.3334 17.0668 13.3334 16.6001 13.3334 15.6667V9.33332C13.3334 8.3999 13.3334 7.93319 13.1518 7.57667C12.992 7.26307 12.737 7.0081 12.4234 6.84831C12.0669 6.66666 11.6002 6.66666 10.6667 6.66666H4.33341C3.39999 6.66666 2.93328 6.66666 2.57676 6.84831C2.26316 7.0081 2.00819 7.26307 1.8484 7.57667C1.66675 7.93319 1.66675 8.3999 1.66675 9.33332V15.6667C1.66675 16.6001 1.66675 17.0668 1.8484 17.4233C2.00819 17.7369 2.26316 17.9919 2.57676 18.1517C2.93328 18.3333 3.39999 18.3333 4.33341 18.3333Z"
            stroke={color}
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_1345_1061">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </Box>
  );
};
