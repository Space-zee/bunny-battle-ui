import s from "./style.module.scss";
import clsx from "clsx";
import { IUserWallet } from "@/app/shared/types";
import Image from "next/image";
import { Flex, Text, Box } from "@radix-ui/themes";
import { formatAddress, formatBalance } from "@/app/shared/utils";
import "@radix-ui/themes/styles.css";

type BalanceItemProps = {
  wallet: IUserWallet;
};

const BalanceItem = ({ wallet }: BalanceItemProps) => {
  const isWarning = Number(wallet.balance) === 0;
  return (
    <Flex className={clsx(s.balanceWrapper, isWarning && s.warningWrapper)}>
      <Image
        className={clsx(s.whiteText, isWarning && s.warningText)}
        src={"/Icon/24/Scroll.svg"}
        alt={"copy"}
        width={24}
        height={24}
      />

      <Text className={s.whiteText}>
        {formatBalance(Number(wallet.balance))} ETH{" "}
      </Text>
    </Flex>
  );
};

export default BalanceItem;
