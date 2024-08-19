import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./style.module.scss";
import { NavItemEnum } from "@/app/(pages)/main/enums";

interface SVGItemProps {
  isActive: boolean;
  variant: NavItemEnum;
  alt: string;
}

const SVG_PATHS = {
  [NavItemEnum.Leaderboard]: "/leaderboard.svg",
  [NavItemEnum.Lobby]: "/lobby.svg",
  [NavItemEnum.Profile]: "/lobby.svg",
};

export const SVGItem: React.FC<SVGItemProps> = ({
  isActive = false,
  variant,
  alt,
}) => {
  return (
    <motion.div
      className={styles.SVGContainer}
      animate={{ scale: isActive ? 1.6 : 1, y: isActive ? -12 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Image
        src={SVG_PATHS[variant]}
        alt={alt}
        width={40}
        height={40}
        className={styles.SVGImage}
      />
    </motion.div>
  );
};
