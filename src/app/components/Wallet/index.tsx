import s from "./style.module.scss";
import clsx from "clsx";
import { IUserWallet } from "@/app/shared/types";
import Image from "next/image";
import { Button, Flex, Box, Text } from "@radix-ui/themes";
import { formatAddress } from "@/app/shared/utils";
import copy from "copy-text-to-clipboard";
import React from "react";

type WalletProps = {
  wallet: IUserWallet;
};

export const Wallet = ({ wallet }: WalletProps) => {
  return (
    <Flex
      className={clsx(s.root, Number(wallet.balance) > 0 && s.active)}
      direction="column"
    >
      <Flex>
        <Image
          className={s.copyIcon}
          src={"/copy.svg"}
          alt={"copy"}
          width={18}
          height={18}
          onClick={() => copy(wallet.wallet)}
        />{" "}
        <Text className={s.whiteText}>{formatAddress(wallet.wallet)} ⋅</Text>
        <Text className={s.grayText}>My balance</Text>{" "}
        <Text className={s.whiteText}>
          {Number(wallet.balance).toFixed(5)} ETH
        </Text>
      </Flex>
      {/*{Number(wallet.balance) > 0 && (*/}
      {/*  <Button onClick={onWithdraw} className={s.withdrawButton}>*/}
      {/*    Withdraw*/}
      {/*  </Button>*/}
      {/*)}*/}
    </Flex>
  );
};
