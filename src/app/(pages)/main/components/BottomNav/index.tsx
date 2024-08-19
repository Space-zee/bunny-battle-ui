import { BotElement } from "./molecule/BotElement";
import { TopElement } from "./molecule/TopElement";
import s from "./style.module.scss";
import { Flex } from "@radix-ui/themes";
import { IUserData } from "@/app/shared/types";
import { NavItemEnum } from "@/app/(pages)/main/enums";

type BottomNavProps = {
  activeTab: NavItemEnum;
  userData: IUserData;
  onSetActiveTab: (tab: NavItemEnum) => void;
  onCopyWallet: (address: string) => void;
};

export const BottomNav = ({
  userData,
  activeTab,
  onSetActiveTab,
  onCopyWallet,
}: BottomNavProps) => {
  return (
    <Flex className={s.bottomNavBar}>
      <TopElement
        activeTab={activeTab}
        onSetActiveTab={onSetActiveTab}
        photo={userData.photo}
      />
      <BotElement onCopyWallet={onCopyWallet} userData={userData} />
    </Flex>
  );
};
