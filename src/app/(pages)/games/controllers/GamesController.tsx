"use client";

import s from "./styles.module.scss";
import React, { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import * as coreModels from "@/app/core/models";
import * as gamesModels from "../models";
import { Text, Box, Flex, Button, Tabs } from "@radix-ui/themes";
import Image from "next/image";
import { colors } from "@/app/shared/constants";
import { Wallet } from "@/app/components/Wallet";
import { useRouter, useSearchParams } from "next/navigation";
import { Game } from "@/app/(pages)/games/components/Game";
import { Loader, Switcher } from "@/app/components";

export default function GamesController() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jwtToken = searchParams.get("token");

  const [activeTab, setActiveTab] = useState("active");

  const [WebApp] = useAtom(coreModels.$webApp);
  const [TgButtons] = useAtom(coreModels.$tgButtons);
  const [userWallet] = useAtom(coreModels.$userWallet);
  const [activeGames] = useAtom(gamesModels.$activeGames);

  const $doLoadWebApp = useSetAtom(coreModels.$doLoadWebApp);
  const $doLoadUserWallet = useSetAtom(coreModels.$doLoadUserWallet);
  const $doLoadActiveGames = useSetAtom(gamesModels.$doLoadActiveGames);
  const $doDeleteGame = useSetAtom(gamesModels.$doDeleteGame);

  const onCreateBattle = () => {
    router.push(`/create?token=${jwtToken}`);
  };

  const onDeleteGame = async (roomId: string) => {
    await $doDeleteGame({ jwtToken, roomId });
    $doLoadActiveGames({ jwtToken });
  };

  useEffect(() => {
    $doLoadWebApp();

    if (WebApp) {
      TgButtons?.showMainButton(onCreateBattle, {
        color: colors.pink400,
        text_color: colors.black,
        text: "Create Battle",
        is_active: !!(userWallet && Number(userWallet.balance) > 0),
      });
      TgButtons?.hideBackButton();
    }
  }, [WebApp, userWallet]);

  useEffect(() => {
    $doLoadUserWallet({ jwtToken });
    $doLoadActiveGames({ jwtToken });
  }, []);

  return !WebApp || !userWallet || !activeGames ? (
    <Loader />
  ) : (
    <main className={s.main}>
      <Box className={s.headerWrapper}>
        <Text className={s.header} weight="bold">
          Combat lobby
        </Text>
        <Image
          src={"/reload.svg"}
          alt={"reload"}
          width={26}
          height={26}
          className={s.reloadIcon}
          onClick={() => {
            $doLoadActiveGames({ jwtToken });
            $doLoadUserWallet({ jwtToken });
          }}
        />
      </Box>
      <Switcher
        activeTab={activeTab}
        tabs={[
          { id: "active", label: "Active" },
          { id: "ended", label: "Ended" },
        ]}
        onSetActiveTab={setActiveTab}
      />
      <Flex className={s.gamesWrapper} direction="column" gap="3">
        {activeGames.map((el, index) => (
          <Game
            webApp={WebApp}
            key={index}
            game={el}
            onDeleteGame={onDeleteGame}
            onEnterGame={() => {
              router.push(`/game/${el.roomId}?token=${jwtToken}`);
            }}
          />
        ))}
      </Flex>
      {userWallet && <Wallet wallet={userWallet} />}
    </main>
  );
}
