import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./style.module.scss";
import { Flex, Box } from "@radix-ui/themes";
import SVGVariant from "./SVGVariant";

interface SVGItemProps {
  isActive: boolean;
  variant: SVGVariant;
  alt: string;
}

const SVG_PATHS = {
  [SVGVariant.Leaderboard]: "/leaderboard.svg",
  [SVGVariant.Lobby]: "/lobby.svg",
  // Add more mappings as needed
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

export { SVGVariant };

// const SVGItemExport = {
//   SVGItem,
//   SVGVariant
// };

// export default SVGItemExport;
