import React from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import styles from "./style.module.scss";

interface LottieItemProps {
  isActive: boolean;
  LottieData: any;
  alt: string;
  // onClick: () => void; // for testing how solo component works
}

export const LottieItem: React.FC<LottieItemProps> = ({ isActive = true }) => {
  return (
    <motion.div
      className={styles.LottieContainer}
      animate={{
        scale: isActive ? 1.6 : 1,
        y: isActive ? -12 : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Lottie
        animationData={require("/public/Lotties/1_rabbits.json")}
        loop={true}
        autoplay={isActive}
        style={{ width: 40, height: 40 }}
      />
    </motion.div>
  );
};
