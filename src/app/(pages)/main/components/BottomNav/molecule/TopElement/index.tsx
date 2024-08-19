import React from "react";
import { motion } from "framer-motion";
import styles from "./style.module.scss";
import { Box, Flex } from "@radix-ui/themes";
import { LottieItem } from "../../atoms/LottieItem";
import { AvatarItem } from "../../atoms/AvatarItem";
import { SVGItem } from "../../atoms/SVGItem";
import { NavItemEnum } from "@/app/(pages)/main/enums";

interface NavItem {
  id: NavItemEnum;
  alt: string;
  type: "lottie" | "avatar" | "svg";
  variant?: NavItemEnum;
}

const navItems: NavItem[] = [
  {
    id: NavItemEnum.Leaderboard,
    alt: "LeaderBoard",
    type: "svg",
    variant: NavItemEnum.Leaderboard,
  },

  {
    id: NavItemEnum.Lobby,
    alt: "Battle Lobby",
    type: "svg",
    variant: NavItemEnum.Lobby,
  },

  { id: NavItemEnum.Profile, alt: "My Profile", type: "avatar" },
];

type TopElementProps = {
  activeTab: NavItemEnum;
  onSetActiveTab: (tab: NavItemEnum) => void;
  photo: string;
};

export const TopElement = ({
  photo,
  activeTab,
  onSetActiveTab,
}: TopElementProps) => {
  const handleItemClick = (id: NavItemEnum) => {
    if (id !== activeTab) {
      onSetActiveTab(id);
    }
  };

  const getSliderPosition = () => {
    switch (activeTab) {
      case NavItemEnum.Leaderboard:
        return "0%";
      case NavItemEnum.Lobby:
        return "50%";
      case NavItemEnum.Profile:
        return "100%";
      default:
        return "50%";
    }
  };

  return (
    <Flex className={styles.bottomNavBar}>
      {navItems.map((item) => (
        <Flex
          key={item.id}
          className={styles.navItemWrapper}
          onClick={() => handleItemClick(item.id)}
        >
          <motion.div key={item.id} whileTap={{ scale: 0.9 }}>
            {item.type === "lottie" && (
              <LottieItem
                LottieData={require("/public/Lotties/1_rabbits.json")}
                alt={item.alt}
                isActive={activeTab === item.id}
              />
            )}
            {item.type === "avatar" && (
              <AvatarItem
                imageSrc={photo}
                alt={item.alt}
                isActive={activeTab === item.id}
              />
            )}
            {item.type === "svg" && item.variant && (
              <SVGItem
                variant={item.variant}
                alt={item.alt}
                isActive={activeTab === item.id}
              />
            )}
          </motion.div>
        </Flex>
      ))}
      <Box className={styles.sliderWrapper}>
        <motion.div
          className={styles.slider}
          animate={{
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
