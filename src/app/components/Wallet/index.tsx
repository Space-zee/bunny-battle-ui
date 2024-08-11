"use client";

import s from "./style.module.scss";
import clsx from "clsx";
import { IUserWallet } from "@/app/shared/types";
import { Flex, Box, Text } from "@radix-ui/themes";
import React from "react";
import { BottomNav } from "@/app/components/bottomNav";

type WalletProps = {
  wallet: IUserWallet;
};

export const Wallet = ({ wallet }: WalletProps) => {
  return (
    <Flex
      className={clsx(s.root, Number(wallet.balance) > 0 && s.active)}
      direction="column"
    >
      <BottomNav wallet={wallet} />
    </Flex>
  );
};
