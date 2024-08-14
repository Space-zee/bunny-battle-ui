"use client";

import s from "./styles.module.scss";
import React, { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import * as coreModels from "@/app/core/models";
import * as gamesModels from "../models";
import { colors } from "@/app/shared/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader } from "@/app/components";
import {
  LeaderboardScene,
  LobbyScene,
  WithdrawScene,
} from "@/app/(pages)/games/components";
import { BottomNav } from "@/app/(pages)/games/components/BottomNav";
import { NavItemEnum } from "@/app/(pages)/games/enums";

export default function GamesController() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jwtToken = searchParams.get("token");

  const [activeNavTab, setActiveNavTab] = useState<NavItemEnum>(
    NavItemEnum.Lobby,
  );

  const [WebApp] = useAtom(coreModels.$webApp);
  const [TgButtons] = useAtom(coreModels.$tgButtons);
  const [userData] = useAtom(coreModels.$userData);
  const [activeGames] = useAtom(gamesModels.$activeGames);
  const [userEndedGames] = useAtom(gamesModels.$userEndedGames);

  const $doLoadWebApp = useSetAtom(coreModels.$doLoadWebApp);
  const $doLoadUserData = useSetAtom(coreModels.$doLoadUserData);
  const $doLoadActiveGames = useSetAtom(gamesModels.$doLoadActiveGames);
  const $doLoadUserEndedGames = useSetAtom(gamesModels.$doLoadUserEndedGames);
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
        is_active: !!(userData && Number(userData.balance) > 0),
      });
      TgButtons?.hideBackButton();
    }
  }, [WebApp, userData]);

  useEffect(() => {
    $doLoadUserData({ jwtToken });
    $doLoadActiveGames({ jwtToken });
    $doLoadUserEndedGames({ jwtToken });
  }, []);

  const onReloadLobby = async () => {
    await $doLoadActiveGames({ jwtToken });
    await $doLoadUserData({ jwtToken });
  };
  const onReloadProfile = async () => {
    await $doLoadUserData({ jwtToken });
  };
  const onEnterGame = (roomId: string) => {
    router.push(`/game/${roomId}?token=${jwtToken}`);
  };

  return !WebApp || !userData || !activeGames ? (
    <Loader />
  ) : (
    <main className={s.main}>
      {activeNavTab === NavItemEnum.Lobby && (
        <LobbyScene
          onDeleteGame={onDeleteGame}
          onEnterGame={onEnterGame}
          onReload={onReloadLobby}
          activeGames={activeGames}
          userEndedGames={userEndedGames}
          WebApp={WebApp}
        />
      )}
      {activeNavTab === NavItemEnum.Leaderboard && <LeaderboardScene />}
      {activeNavTab === NavItemEnum.Profile && (
        <WithdrawScene
          onReload={onReloadProfile}
          userData={userData}
          WebApp={WebApp}
        />
      )}
      {userData && (
        <BottomNav
          activeTab={activeNavTab}
          onSetActiveTab={setActiveNavTab}
          userData={userData}
        />
      )}
    </main>
  );
}
