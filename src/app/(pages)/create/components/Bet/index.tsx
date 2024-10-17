import s from "./style.module.scss";
import clsx from "clsx";
import Image from "next/image";
import { Flex, Text } from "@radix-ui/themes";
import { formatValue } from "@/app/shared/utils";

type BetProps = {
  amount: string;
  nativePrice: number;
  onClick: () => void;
};

export const Bet = ({ amount, nativePrice, onClick }: BetProps) => {
  return (
    <Flex
      className={clsx(s.root)}
      direction="column"
      align="center"
      onClick={onClick}
    >
      <Flex>
        <Image src={"/eth.svg"} alt={"eth"} width={24} height={24} />
        <Text className={s.amount}>{amount}</Text>
      </Flex>
      <Text className={s.usdAmount}>
        ≈ ${formatValue(String(Number(amount) * nativePrice))}
      </Text>
    </Flex>
  );
};
