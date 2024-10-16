"use client";

import s from "./styles.module.scss";
import React, { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import * as coreModels from "@/app/core/models";
import * as gamesModels from "../models";
import { colors } from "@/app/shared/constants";
import { useRouter } from "next/navigation";
import { Loader } from "@/app/components";
import {
  LeaderboardScene,
  LobbyScene,
  WithdrawScene,
} from "@/app/(pages)/main/components";
import { BottomNav } from "@/app/(pages)/main/components/BottomNav";
import { NavItemEnum } from "@/app/(pages)/main/enums";
import copy from "copy-text-to-clipboard";
import { NotificationTitleIcon } from "@/app/shared/enums";
import { socket } from "@/app/core/ws/socket";
import { SocketEvents } from "@/app/core/ws/constants";
import { IGetActiveGamesRes } from "@/app/shared/types";

export default function MainController() {
  const router = useRouter();

  const [activeNavTab, setActiveNavTab] = useState<NavItemEnum>(
    NavItemEnum.Lobby,
  );

  const [WebApp] = useAtom(coreModels.$webApp);
  const [TgButtons] = useAtom(coreModels.$tgButtons);
  const [userData] = useAtom(coreModels.$userData);
  const [nativePrice] = useAtom(coreModels.$nativePrice);
  const [activeGames, setActiveGames] = useAtom(gamesModels.$activeGames);
  const [userEndedGames] = useAtom(gamesModels.$userEndedGames);
  const [estimatedGameGasCost] = useAtom(coreModels.$estimatedGameGasCost);

  const [, setNotification] = useAtom(coreModels.$notification);
  const [secondNotification, setSecondNotification] = useAtom(
    coreModels.$secondNotification,
  );

  const $doLoadWebApp = useSetAtom(coreModels.$doLoadWebApp);
  const $doLoadUserData = useSetAtom(coreModels.$doLoadUserData);
  const $doLoadActiveGames = useSetAtom(gamesModels.$doLoadActiveGames);
  const $doLoadUserEndedGames = useSetAtom(gamesModels.$doLoadUserEndedGames);
  const $doDeleteGame = useSetAtom(gamesModels.$doDeleteGame);
  const $doWithdraw = useSetAtom(gamesModels.$doWithdraw);
  const $doLoadEstimatedGameGasCost = useSetAtom(
    coreModels.$doLoadEstimatedGameGasCost,
  );

  const onCreateBattle = () => {
    setSecondNotification({ ...secondNotification, isOpen: false });
    if (userData?.isActiveGames) {
      setNotification({
        isOpen: true,
        titleIcon: NotificationTitleIcon.Lock,
        title: "You already have an active game",
        description: {
          text: "You can only have one active game at a time. Please end or delete your existing game to start a new one.",
        },
      });
    } else {
      router.push(`/create`);
    }
  };

  const onWithdraw = async (amount: string, to: string) => {
    return !!(await $doWithdraw({ amount, to }));
  };

  const onDeleteGame = async (roomId: string) => {
    await $doDeleteGame({ roomId });
    $doLoadActiveGames();
    $doLoadUserData();
  };

  useEffect(() => {
    $doLoadWebApp();

    if (WebApp) {
      WebApp.expand();
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
    $doLoadUserData();
    $doLoadActiveGames();
    $doLoadUserEndedGames();
    $doLoadEstimatedGameGasCost();
  }, []);

  const onNewGameCreated = (game: IGetActiveGamesRes) => {
    setActiveGames((prev) => [...prev, game]);
  };

  const onGameDeleted = (roomId: string) => {
    const filteredGames: IGetActiveGamesRes[] = activeGames.filter(
      (el) => el.roomId !== roomId,
    );
    setActiveGames(filteredGames);
  };

  useEffect(() => {
    socket.on(`${SocketEvents.NewGameCreated}`, onNewGameCreated);
    socket.on(`${SocketEvents.GameDeleted}`, onGameDeleted);

    return () => {
      socket.off(`${SocketEvents.NewGameCreated}`, onNewGameCreated);
      socket.off(`${SocketEvents.GameDeleted}`, onGameDeleted);
    };
  }, []);

  const onReloadLobby = async () => {
    await $doLoadActiveGames();
    await $doLoadUserData();
    await $doLoadEstimatedGameGasCost();
  };

  const onReloadProfile = async () => {
    await $doLoadUserData();
  };

  const onEnterGame = (roomId: string) => {
    router.push(`/game/${roomId}`);
  };

  const onCopyWallet = (address: string) => {
    copy(address);
    setSecondNotification({
      isOpen: true,
      text: "✅ Adress coppied",
      bottom: "128",
    });
  };

  return !WebApp ||
    !TgButtons ||
    !userData ||
    !activeGames ||
    !estimatedGameGasCost ? (
    <Loader />
  ) : (
    <main className={s.main}>
      {activeNavTab === NavItemEnum.Lobby && (
        <LobbyScene
          nativePrice={nativePrice}
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
          nativePrice={nativePrice}
          onWithdraw={onWithdraw}
          onCreateBattle={onCreateBattle}
          TgButtons={TgButtons}
          onReload={onReloadProfile}
          userData={userData}
        />
      )}
      {userData && (
        <BottomNav
          onCopyWallet={onCopyWallet}
          activeTab={activeNavTab}
          onSetActiveTab={setActiveNavTab}
          userData={userData}
        />
      )}
    </main>
  );
}
