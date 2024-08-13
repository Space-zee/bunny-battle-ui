import { BotElement } from "./molecule/BotElement";
import { TopElement } from "./molecule/TopElement";
import s from "./style.module.scss";
import { Flex } from "@radix-ui/themes";
import { IUserData } from "@/app/shared/types";
import { NavItemEnum } from "@/app/(pages)/games/enums";

type BottomNavProps = {
  activeTab: NavItemEnum;
  onSetActiveTab: (tab: NavItemEnum) => void;
  userData: IUserData;
};

export const BottomNav = ({
  userData,
  activeTab,
  onSetActiveTab,
}: BottomNavProps) => {
  return (
    <Flex className={s.bottomNavBar}>
      <TopElement
        activeTab={activeTab}
        onSetActiveTab={onSetActiveTab}
        photo={userData.photo}
      />
      <BotElement userData={userData} />
    </Flex>
  );
};
