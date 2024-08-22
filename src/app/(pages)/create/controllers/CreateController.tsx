"use client";

import s from "./styles.module.scss";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom, useSetAtom } from "jotai";
import * as coreModels from "@/app/core/models";
import * as createModels from "../models";
import { Text, Box, Flex } from "@radix-ui/themes";
import { colors } from "@/app/shared/constants";
import { Input } from "@/app/components";
import { PRESETS } from "@/app/(pages)/create/constants";
import { Bet } from "@/app/(pages)/create/components";
import Image from "next/image";
import { NotificationTitleIcon } from "@/app/shared/enums";
import { formatBalance } from "@/app/shared/utils";
import {
  getBalanceDeficitForFee,
  isEnoughBalanceForFee,
} from "@/app/(pages)/utils";
import copy from "copy-text-to-clipboard";
import { BotElement } from "../../main/components/BottomNav/molecule/BotElement";

export default function CreateController() {
  const router = useRouter();

  const [bet, setBet] = useState("");
  const [error, setError] = useState("");

  const [TgButtons] = useAtom(coreModels.$tgButtons);
  const [userData] = useAtom(coreModels.$userData);
  const [estimatedGameGasCost] = useAtom(coreModels.$estimatedGameGasCost);

  const [, setNotification] = useAtom(coreModels.$notification);
  const [, setSecondNotification] = useAtom(coreModels.$secondNotification);

  const $doCreateGame = useSetAtom(createModels.$doCreateGame);

  const onBack = () => {
    router.push(`/main`);
  };

  const onChange = (event: any) => {
    const value = event.target.value;
    validateBet(value);
  };
  const onConfirm = async () => {
    const res = await $doCreateGame({ bet: Number(bet).toFixed(5) });
    if (res && res.success) {
      router.push(`/game/${res.data?.roomId}`);
    }
  };

  const isValidNumber = (value: string) =>
    /^-?\d*\.?\d*$/.test(value) && Number(value) >= 0;
  const isEnoughBalance = (value: string) =>
    Number(value) <= Number(userData?.balance);

  const validateBet = (value: string) => {
    if (!isValidNumber(value)) {
      setError("Invalid number");
      return;
    }
    if (!isEnoughBalance(value)) {
      setBet(value);
      setError("Not enough balance");
      return;
    }
    if (
      !isEnoughBalanceForFee(
        value,
        estimatedGameGasCost?.estimatedGameGasCost || "0",
        userData?.balance || "0",
      )
    ) {
      const deficit = formatBalance(
        getBalanceDeficitForFee(
          value,
          estimatedGameGasCost?.estimatedGameGasCost || "0",
          userData?.balance || "0",
        ),
      );
      setNotification({
        isOpen: true,
        bottom: "56",
        titleIcon: NotificationTitleIcon.Warning,
        title: "Insufficient Funds",
        description: {
          text: `Please deposit at least <strong>${deficit} ETH</strong> to cover transaction fees and proceed with this bet, or lower the bet amount.`,
        },
      });
    }
    setBet(value);
    setError("");
  };

  useEffect(() => {
    if (TgButtons) {
      TgButtons.showMainButton(onConfirm, {
        color: colors.pink400,
        text_color: colors.black,
        text: "Confirm",
        is_active: Number(userData?.balance) > Number(bet),
      });
      TgButtons.showBackButton(onBack);
    }
  }, []);

  useEffect(() => {
    if (TgButtons) {
      TgButtons.showMainButton(onConfirm, {
        color: colors.pink400,
        text_color: colors.black,
        text: "Confirm",
        is_active:
          !error &&
          Number(userData?.balance) > Number(bet) &&
          Number(bet) !== 0,
      });
    }
  }, [error, bet]);

  const onCopyWallet = (address: string) => {
    copy(address);
    setSecondNotification({
      isOpen: true,
      text: "✅ Adress coppied",
      bottom: "56",
    });
  };

  return (
    <main className={s.main}>
      <Text className={s.header}>
        Create <span className={s.name}>BunnyBattle</span>
      </Text>
      <Box className={s.wrapper}>
        <Text className={s.whiteHeader}>Set custom bet amount</Text>
        <Input
          className={s.input}
          onChange={onChange}
          placeholder={"Min amount is 0.001 ETH"}
          error={error}
          value={bet}
        />
      </Box>

      <Box className={s.wrapper}>
        <Text className={s.whiteHeader}>Or use presets</Text>
        <Flex className={s.presetsWrapper}>
          {PRESETS.map((el) => (
            <Bet key={el} amount={el} onClick={() => validateBet(el)} />
          ))}
        </Flex>
      </Box>
      <Box className={s.details}>
        <Box className={s.detailsHeaderWrapper}>
          <Image src={"/info.svg"} alt={"info"} width={16} height={16} />
          <Text className={s.detailsHeader}>Battle reward logic</Text>
        </Box>
        <Text className={s.detailsDescription}>
          If you win the battle, you will receive a reward equal to 99% of your
          bet, where 1% is a fee
        </Text>
      </Box>
      <Box className={s.bottomNavBar}>
        {userData && (
          <BotElement
            onCopyWallet={onCopyWallet}
            userData={userData}
            fullRounded={true}
          />
        )}
      </Box>
    </main>
  );
}
