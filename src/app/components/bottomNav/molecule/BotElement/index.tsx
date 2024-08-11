import React from "react";
import BalanceItem from "../../atoms/BalanceItem";
import WalletItem from "../../atoms/WalletItem";
import s from "./style.module.scss";
import { Flex } from "@radix-ui/themes";
import { IUserWallet } from "@/app/shared/types";

type BotElementProps = {
  wallet: IUserWallet;
};
export const BotElement = ({ wallet }: BotElementProps) => {
  return (
    <Flex className={s.botElement}>
      <WalletItem wallet={wallet} />
      <BalanceItem wallet={wallet} />
    </Flex>
  );
};
