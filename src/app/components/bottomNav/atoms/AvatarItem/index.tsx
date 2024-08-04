import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./style.module.scss";
import { Flex, Box } from "@radix-ui/themes";

interface AvatarItemProps {
  isActive: boolean;
  imageSrc: string;
  alt: string;
  // onClick: () => void;
}

const AvatarItem: React.FC<AvatarItemProps> = ({
  isActive = false,
  imageSrc,
  alt,
}) => {
  return (
    <motion.div
      className={`${styles.avatarContainer} ${isActive ? styles.active : ""}`}
      animate={{ scale: isActive ? 1.6 : 1, y: isActive ? -8 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      // onClick={onClick}
    >
      <Image
        src="/KolomsAva.png"
        alt={alt}
        width={40}
        height={40}
        className={styles.avatarImage}
      />
      <Box className={styles.avatarCircle}></Box>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: -20 }}
        >
          <Image
            src="/BB-logo.svg"
            alt={alt}
            width={24}
            height={24}
            className={styles.avatarEars}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default AvatarItem;
