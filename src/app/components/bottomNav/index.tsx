import { BotElement } from "./molecule/BotElement";
import { TopElement } from "./molecule/TopElement";
import s from "./style.module.scss";
import { Flex } from "@radix-ui/themes";

export const BottomNav: React.FC = () => {
  return (
    <Flex className={s.bottomNavBar}>
      <TopElement />
      <BotElement />
    </Flex>
  );
};
