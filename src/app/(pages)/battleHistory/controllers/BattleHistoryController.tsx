'use client';
import React from "react";
import { Text, Box, Flex, Avatar } from "@radix-ui/themes";
import s from "./styles.module.scss";
import { motion } from 'framer-motion';
import AvatarItem from "@/app/components/bottomNav/atoms/AvatarItem";

// Mock data for the battle history
const mockHistory = [
  { action: "You fired in 1 cell", type: "fire" },
  { action: "@DeinerisTargarian fired in 2 cell", type: "hit" },
  { action: "You fired in 2 cell", type: "fire" },
  { action: "@DeinerisTargarian fired in 3 cell", type: "fire" },
  { action: "You fired in 1 cell", type: "fire" },
  { action: "@DeinerisTargarian fired in 2 cell", type: "hit" },
  { action: "You Confirmed Lose", type: "lose" },
];

export default function BattleHistoryController() {
  return (
    <main className={s.main}>
      <Box className={s.container}>
      <Avatar size="8" radius="none" fallback="🎉" className={s.emoji} />
        <Text className={s.title}>Congratulations on<br />your victory</Text>
        <Text className={s.reward}>You got</Text>
        <Text className={s.amount}>0.000199 ETH</Text>
        <Text className={s.historyTitle}>#13 BunnBattle History</Text>
        <Box className={s.historyContainer}>
          {mockHistory.map((item, index) => (
            <Flex key={index} className={s.historyItem}>
              <Text className={s[item.type]}>{item.action}</Text>
              <Text className={s.txLink}>go to txn</Text>
            </Flex>
          ))}
        </Box>
        <motion.button className={s.backButton} whileTap={{ scale: 0.95 }}>
        Back to Lobby
        </motion.button>
      </Box>
    </main>
  );
  
}