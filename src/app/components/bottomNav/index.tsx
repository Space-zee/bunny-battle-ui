import React, { useState, useEffect } from "react";
import { BotElement } from "./molecule/BotElement";
import { TopElement } from "./molecule/TopElement";
import s from "./style.module.scss";
import { Flex } from "@radix-ui/themes";
import * as Toast from "@radix-ui/react-toast";
import { IUserWallet } from "@/app/shared/types";
import "@radix-ui/themes/styles.css";
import { AnimatePresence } from "framer-motion";

type BottomNavProps = {
  wallet: IUserWallet;
};

export const BottomNav = ({ wallet }: BottomNavProps) => {
  const [isToastOpen, setIsToastOpen] = useState(false);

  const handleCopy = () => {
    setIsToastOpen(false);
    setTimeout(() => setIsToastOpen(true), 10);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isToastOpen) {
      timer = setTimeout(() => {
        setIsToastOpen(false);
      }, 800); // Toast will be visible for 3 seconds
    }
    return () => clearTimeout(timer);
  }, [isToastOpen]);

  return (
    <>
      <Toast.Provider swipeDirection="right" duration={3000}>
        <Flex className={s.bottomNavBar}>
          <TopElement />
          <BotElement wallet={wallet} oncopy={handleCopy} />
        </Flex>
        <Toast.Root
          open={isToastOpen}
          onOpenChange={setIsToastOpen}
          className={s.toastRoot}
        >
          <Toast.Title>✅ Adress coppied</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className={s.toastViewport} />
      </Toast.Provider>
    </>
  );
};

export default BottomNav;
