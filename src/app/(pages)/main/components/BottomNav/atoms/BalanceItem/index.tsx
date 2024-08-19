import s from "./style.module.scss";
import clsx from "clsx";
import { IUserData } from "@/app/shared/types";
import Image from "next/image";
import { Flex, Text } from "@radix-ui/themes";
import { formatBalance } from "@/app/shared/utils";
import "@radix-ui/themes/styles.css";

type BalanceItemProps = {
  userData: IUserData;
};

const BalanceItem = ({ userData }: BalanceItemProps) => {
  const isWarning = Number(userData.balance) === 0;
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
        {formatBalance(Number(userData.balance))} ETH{" "}
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
