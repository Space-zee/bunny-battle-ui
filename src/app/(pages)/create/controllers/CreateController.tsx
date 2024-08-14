"use client";

import s from "./styles.module.scss";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAtom, useSetAtom } from "jotai";
import * as coreModels from "@/app/core/models";
import * as createModels from "../models";
import { Text, Box, Flex } from "@radix-ui/themes";
import { colors } from "@/app/shared/constants";
import { Input } from "@/app/components";
import { PRESETS } from "@/app/(pages)/create/constants";
import { Bet } from "@/app/(pages)/create/components";
import Image from "next/image";

export default function CreateController() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const jwtToken = searchParams.get("token");

  const [bet, setBet] = useState("");
  const [error, setError] = useState("");

  const [TgButtons] = useAtom(coreModels.$tgButtons);
  const [userData] = useAtom(coreModels.$userData);

  const $doCreateGame = useSetAtom(createModels.$doCreateGame);

  const onBack = () => {
    router.push(`/games?token=${jwtToken}`);
  };

  const onChange = (event: any) => {
    const value = event.target.value;
    validateBet(value);
  };
  const onConfirm = async () => {
    const res = await $doCreateGame({ jwtToken, bet: Number(bet).toFixed(5) });
    if (res && res.success) {
      router.push(`/game/${res.data?.roomId}?token=${jwtToken}`);
    }
  };

  const validateBet = (value: string) => {
    if (/^-?\d*\.?\d*$/.test(value)) {
      if (Number(value) > Number(userData?.balance) && Number(value) < 0) {
        setBet(value);
        setError("Not enough balance");
      } else {
        setBet(value);
        setError("");
      }
    } else {
      setError("Invalid number");
    }
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

  return (
    <main className={s.main}>
      <Text className={s.header}>
        Create <span className={s.name}>BunnBattle</span>
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
    </main>
  );
}
