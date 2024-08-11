import { BotElement } from "./molecule/BotElement";
import { TopElement } from "./molecule/TopElement";
import s from "./style.module.scss";
import { Flex } from "@radix-ui/themes";
import { IUserWallet } from "@/app/shared/types";

type BottomNavProps = {
  wallet: IUserWallet;
};

export const BottomNav = ({ wallet }: BottomNavProps) => {
  return (
    <Flex className={s.bottomNavBar}>
      <TopElement />
      <BotElement wallet={wallet} />
    </Flex>
  );
};
