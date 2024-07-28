import s from "./style.module.scss";
import clsx from "clsx";
import Image from "next/image";
import { Flex, Text } from "@radix-ui/themes";

type BetProps = {
  amount: string;
  onClick: () => void;
};

export const Bet = ({ amount, onClick }: BetProps) => {
  return (
    <Flex className={clsx(s.root)} onClick={onClick}>
      <Image src={"/eth.svg"} alt={"eth"} width={24} height={24} />
      <Text className={s.amount}>{amount}</Text>
    </Flex>
  );
};
