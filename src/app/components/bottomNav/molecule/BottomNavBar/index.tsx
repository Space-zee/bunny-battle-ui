// components/BottomNavBar/BottomNavBar.tsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AvatarItem from "../../atoms/AvatarItem";
import LottieItem from "../../atoms/LottieItem";
import styles from "./style.module.scss";
import { Box, Flex } from "@radix-ui/themes";
import { SVGItem, SVGVariant } from "../../atoms/SVGItem";

interface NavItem {
  id: string;
  alt: string;
  type: "lottie" | "avatar" | "svg";
  variant?: SVGVariant;
}

const navItems: NavItem[] = [
  {
    id: "item1",
    alt: "LeaderBoard",
    type: "svg",
    variant: SVGVariant.Leaderboard,
  },

  { id: "item2", alt: "Battle Lobby", type: "svg", variant: SVGVariant.Lobby },

  { id: "item3", alt: "My Profile", type: "avatar" },
];

const BottomNavBar: React.FC = () => {
  const [activeItemId, setActiveItemId] = useState<string | null>("2");

  const handleItemClick = (id: string) => {
    // setActiveItemId((prevId) => (prevId === id ? null : id));
    if (id !== activeItemId) {
      setActiveItemId(id);
    }
  };

  const getSliderPosition = () => {
    switch (activeItemId) {
      case "item1":
        return "0%";
      case "item2":
        return "50%";
      case "item3":
        return "100%";
      default:
        return "50%"; // Default to center
    }
  };

  return (
    <Flex className={styles.bottomNavBar}>
      {navItems.map((item, index) => (
        <Flex key={item.id} className={styles.navItemWrapper}>
          <motion.div
            key={item.id}
            // className={styles.navItemWrapper}
            onClick={() => handleItemClick(item.id)}
            whileTap={{ scale: 0.9 }}
          >
            {item.type === "lottie" && (
              <LottieItem
                LottieData={require("/public/Lotties/1_rabbits.json")}
                alt={item.alt}
                isActive={activeItemId === item.id}
              />
            )}
            {item.type === "avatar" && (
              <AvatarItem
                imageSrc="/path/to/image.jpg"
                alt={item.alt}
                isActive={activeItemId === item.id}
              />
            )}
            {item.type === "svg" && item.variant && (
              <SVGItem
                variant={item.variant}
                alt={item.alt}
                isActive={activeItemId === item.id}
              />
            )}
          </motion.div>
        </Flex>
      ))}
      <Box className={styles.sliderWrapper}>
        <motion.div
          className={styles.slider}
          animate={{
            // justifyContent: getSliderPosition(),
            left: getSliderPosition(),
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      </Box>
    </Flex>
  );
};

export default BottomNavBar;
