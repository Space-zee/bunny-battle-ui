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
        className={clsx(s.copyIcon, isWarning && s.warningIcon)}
        src={"/Icon/24/Scroll.svg"}
        alt={"copy"}
        width={24}
        height={24}
      />
      <Text className={clsx(s.whiteText, isWarning && s.blackText)}>
        {formatBalance(Number(wallet.balance))} ETH{" "}
      </Text>
      {isWarning && (
        <Image
          src="/Icon/24/warning.svg"
          alt="warning"
          width={24}
          height={24}
        />
      )}
    </Flex>
  );
};

export default BalanceItem;
