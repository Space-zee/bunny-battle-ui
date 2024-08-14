import s from "./style.module.scss";
import { Button, Text, Flex, Box } from "@radix-ui/themes";
import Image from "next/image";
import React from "react";
import { WebApp } from "@twa-dev/types";
import { IUserData } from "@/app/shared/types";
import { motion } from "framer-motion";
import { Avatar } from "@/app/components";
import { formatBalance } from "@/app/shared/utils";
import { colors } from "@/app/shared/constants";

type WithdrawSceneProps = {
  WebApp: WebApp;
  userData: IUserData;
  onReload: () => void;
};

export const WithdrawScene = ({
  WebApp,
  userData,
  onReload,
}: WithdrawSceneProps) => {
  return (
    <Flex className={s.root} direction="column" align="center" justify="center">
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
        <Flex className={s.profileWrapper} justify="between" direction="column">
          <Flex justify="between">
            <Flex align="center" justify="center">
              <Avatar photo={userData.photo} width={48} height={48} />
              <Text className={s.username}>
                @
                {WebApp.initDataUnsafe.user?.username
                  ? WebApp.initDataUnsafe.user?.username
                  : "hidden"}
              </Text>
            </Flex>
            <Flex direction="column" align="end" justify="center">
              <Text className={s.totalBalanceHeader}>Total balance</Text>
              <Text className={s.totalBalance}>
                {formatBalance(Number(userData.balance))} ETH
              </Text>
            </Flex>
          </Flex>
          <Button className={s.withdrawButton}>
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
