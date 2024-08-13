import React from "react";
import BalanceItem from "../../atoms/BalanceItem";
import WalletItem from "../../atoms/WalletItem";
import s from "./style.module.scss";
import { Flex } from "@radix-ui/themes";
import { IUserData } from "@/app/shared/types";

type BotElementProps = {
  userData: IUserData;
};
export const BotElement = ({ userData }: BotElementProps) => {
  return (
    <Flex className={s.botElement}>
      <WalletItem userData={userData} />
      <BalanceItem userData={userData} />
    </Flex>
  );
};
