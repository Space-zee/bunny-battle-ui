import s from "./style.module.scss";
import { Button, Text, Flex, Box } from "@radix-ui/themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { WebApp } from "@twa-dev/types";
import { IUserData } from "@/app/shared/types";
import { motion } from "framer-motion";
import { Avatar } from "@/app/components";
import { formatBalance, TgButtons } from "@/app/shared/utils";
import { colors } from "@/app/shared/constants";
import { WithdrawWindow } from "@/app/(pages)/games/components/WithdrawWindow";
import clsx from "clsx";

type WithdrawSceneProps = {
  WebApp: WebApp;
  TgButtons: TgButtons;
  userData: IUserData;
  onReload: () => void;
  onCreateBattle: () => void;
  onWithdraw: (amount: string, to: string) => Promise<boolean>;
};

export const WithdrawScene = ({
  WebApp,
  userData,
  onReload,
  TgButtons,
  onCreateBattle,
  onWithdraw,
}: WithdrawSceneProps) => {
  const [isShowWithdrawWindow, setShowWithdrawWindow] = useState(false);

  useEffect(() => {
    if (!isShowWithdrawWindow) {
      TgButtons.mainButton.hideProgress();
      TgButtons.showMainButton(onCreateBattle, {
        color: colors.pink400,
        text_color: colors.black,
        text: "Create Battle",
        is_active: userData && Number(userData.balance) > 0,
      });
    }
  }, [isShowWithdrawWindow]);

  const formatUsername = (username: string) => {
    if (username.length > 20) {
      return `${username.slice(0, 20)}...`;
    } else {
      return username;
    }
  };
  return (
    <Flex className={s.root} align="center" justify="center">
      <Flex
        className={clsx(s.contentWrapper, isShowWithdrawWindow && s.disabled)}
        direction="column"
        align="center"
        justify="center"
      >
        <motion.div
          whileTap={{ scale: 0.9 }}
          className={s.headerWrapper}
          onClick={onReload}
        >
          <Text className={s.header}>My profile</Text>
          <Image
            src={"/reload.svg"}
            alt={"reload"}
            width={26}
            height={26}
            className={s.reloadIcon}
          />
        </motion.div>

        <Flex className={s.profileWrapperBorder}>
          <Flex
            className={s.profileWrapper}
            justify="between"
            direction="column"
          >
            <Flex className={s.profileTopWrapper} justify="between">
              <Flex align="center">
                <Avatar photo={userData.photo} width={48} height={48} />
                <Text className={s.username}>
                  @
                  {WebApp.initDataUnsafe.user?.username
                    ? formatUsername(WebApp.initDataUnsafe.user?.username)
                    : "hidden"}
                </Text>
              </Flex>
              <Box className={s.balanceWrapper}>
                <Text className={s.totalBalanceHeader}>Total balance</Text>
                <Text className={s.totalBalance}>
                  {formatBalance(Number(userData.balance))} ETH
                </Text>
              </Box>
            </Flex>
            <Button
              onClick={() => setShowWithdrawWindow(true)}
              className={s.withdrawButton}
            >
              <Text>Withdraw</Text>
              <Image
                src={"/withdraw.svg"}
                alt={"withdraw"}
                width={20}
                height={20}
              />
            </Button>
          </Flex>
        </Flex>

        <Flex className={s.gamesStatsWrapper}>
          <CustomBox
            header={"Wins"}
            value={userData.wins.toString()}
            color={colors.green400}
          />
          <CustomBox
            header={"Loses"}
            value={userData.loses.toString()}
            color={colors.error400}
          />
          <CustomBox header={"MMR"} value={"SOON"} color={colors.white} />
        </Flex>
      </Flex>
      {isShowWithdrawWindow && (
        <WithdrawWindow
          TgButtons={TgButtons}
          onWithdraw={onWithdraw}
          onClose={() => setShowWithdrawWindow(false)}
          balance={userData.balance}
        />
      )}
    </Flex>
  );
};

const CustomBox = ({
  color,
  header,
  value,
}: {
  header: string;
  value: string;
  color: string;
}) => {
  return (
    <Box className={s.customBoxWrapperBorder}>
      <Flex className={s.customBoxWrapper} direction="column">
        <Text className={s.customBoxHeader}>{header}</Text>
        <Text className={s.customBoxValue} style={{ color }}>
          {value}
        </Text>
      </Flex>
    </Box>
  );
};
