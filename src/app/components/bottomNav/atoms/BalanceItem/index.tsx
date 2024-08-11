import s from "./style.module.scss";
import clsx from "clsx";
import { IUserWallet } from "@/app/shared/types";
import Image from "next/image";
import { Flex, Text, Box } from "@radix-ui/themes";
import { formatAddress } from "@/app/shared/utils";
import copy from "copy-text-to-clipboard";
import "@radix-ui/themes/styles.css";

type BalanceItemProps = {
  wallet: IUserWallet;
};

export const BalanceItem = ({ wallet }: BalanceItemProps) => {
  return (
    <Flex className={clsx(s.root, Number(wallet.balance) > 0 && s.active)}>
      <Flex width="24px" height="24px">
        <Image
          className={s.copyIcon}
          src={"/copy.svg"}
          alt={"copy"}
          width={18}
          height={18}
          onClick={() => copy(wallet.wallet)}
        />{" "}
      </Flex>
      <Text className={s.whiteText}>{formatAddress(wallet.wallet)} ⋅</Text>
      <Text className={s.grayText}>My balance</Text>{" "}
      <Text className={s.whiteText}>{wallet.balance} ETH</Text>
    </Flex>
  );
};
