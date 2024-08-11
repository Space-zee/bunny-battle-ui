// components/BottomNavBar/BottomNavBar.tsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import BalanceItem from "../../atoms/BalanceItem";
import WalletItem from "../../atoms/WalletItem";
import s from "./style.module.scss";
import { Box, Flex } from "@radix-ui/themes";
import { useAtom, useSetAtom } from "jotai";
import * as coreModels from "@/app/core/models";

export const BotElement: React.FC = () => {
  const [userWallet] = useAtom(coreModels.$userWallet);
  return (
    <Flex className={s.botElement}>
      <WalletItem wallet={userWallet} />
      <BalanceItem wallet={userWallet} />
    </Flex>
  );
};
