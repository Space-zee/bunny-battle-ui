import React from "react";
import BalanceItem from "../../atoms/BalanceItem";
import WalletItem from "../../atoms/WalletItem";
import s from "./style.module.scss";
import { Flex } from "@radix-ui/themes";
import { IUserData } from "@/app/shared/types";
import clsx from "clsx";

type BotElementProps = {
  userData: IUserData;
  onCopyWallet: (address: string) => void;
  fullRounded?: boolean;
};
export const BotElement = ({
  userData,
  onCopyWallet,
  fullRounded = false,
}: BotElementProps) => {
  return (
    <Flex
      className={clsx(s.botElement, {
        [s.fullRounded]: fullRounded,
      })}
    >
      <WalletItem onCopyWallet={onCopyWallet} userData={userData} />
      <BalanceItem userData={userData} />
    </Flex>
  );
};
