"use client";

import s from "./styles.module.scss";
import React, { useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useAtom, useSetAtom } from "jotai";
import * as coreModels from "@/app/core/models";
import * as gameModels from "../models";
import { Field } from "@/app/(pages)/game/components/Field";
import { Box, Flex, Text } from "@radix-ui/themes";
import Image from "next/image";
import { UsernameBox } from "@/app/(pages)/game/components";
import { socket } from "@/app/core/ws/socket";
import { joinRoom } from "@/app/core/ws/handlers";
import { SocketEvents } from "@/app/core/ws/constants";
import { IJoinRoomRes, IReadyForBattle } from "@/app/core/ws/types";
import { GameStatusEnum, IGame } from "../models";
import { colors } from "@/app/shared/constants";

export default function GameController() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = useParams<{ id: string }>().id;

  const jwtToken = searchParams.get("token");

  const [WebApp] = useAtom(coreModels.$webApp);
  const [TgButtons] = useAtom(coreModels.$tgButtons);
  const [game, setGame] = useAtom(gameModels.$game);

  const $doLoadWebApp = useSetAtom(coreModels.$doLoadWebApp);

  const onReadyForBattle = (data: IReadyForBattle) => {
    setGame((prevState) => ({
      ...prevState,
      isCreator:
        data.roomCreatorId === (WebApp?.initDataUnsafe.user?.id as number),
      bet: data.bet,
      opponent: {
        steps: [],
        userName:
          data.roomCreatorId === (WebApp?.initDataUnsafe.user?.id as number)
            ? data.opponentName
            : data.creatorName,
        isInRoom: true,
      },
      steps: [],
    }));
  };

  const onCreateBattle = () => {};

  const onLeaveRoom = () => {
    setGame((prevState) => ({
      ...prevState,
      opponent: { isInRoom: false, steps: [] },
    }));
  };

  const onJoinRoomRes = (data: IJoinRoomRes) => {
    setGame((prevState) => ({
      ...prevState,
      isCreator:
        data.roomCreatorId === (WebApp?.initDataUnsafe.user?.id as number),
      bet: data.bet,
      opponent: {
        steps: [],
        userName: data.opponentName,
        isInRoom: false,
      },
      steps: [],
    }));
  };

  useEffect(() => {
    socket.on(`${SocketEvents.JoinRoomServer}:${roomId}`, onJoinRoomRes);
    socket.on(`${SocketEvents.ReadyForBattle}:${roomId}`, onReadyForBattle);
    socket.on(`${SocketEvents.LeaveRoomServer}:${roomId}`, onLeaveRoom);

    return () => {
      socket.off(`${SocketEvents.JoinRoomServer}:${roomId}`, onJoinRoomRes);
      socket.off(`${SocketEvents.ReadyForBattle}:${roomId}`, onReadyForBattle);
      socket.off(`${SocketEvents.LeaveRoomServer}:${roomId}`, onLeaveRoom);

      socket.emit(SocketEvents.LeaveRoomClient, {
        roomId,
        telegramUserId: WebApp?.initDataUnsafe.user?.id as number,
      });
      setGame({
        myRabbits: [],
        steps: [],
        status: GameStatusEnum.RabbitsSet,
        isScCreated: false,
        opponent: {
          steps: [],
          isInRoom: false,
        },
      });
    };
  }, []);

  useEffect(() => {
    $doLoadWebApp();
    if (TgButtons) {
      TgButtons.showBackButton(() => {
        router.push(`/games?token=${jwtToken}`);
      });
    }

    joinRoom({
      roomId,
      telegramUserId: WebApp?.initDataUnsafe.user?.id as number,
    });
  }, [WebApp]);

  useEffect(() => {
    if (game) {
      TgButtons?.showMainButton(onCreateBattle, {
        color: colors.pink400,
        text_color: colors.black,
        text: `Sent ${game.bet}`,
        is_active: false,
      });
    }
  }, [game.bet]);

  useEffect(() => {
    if (game.status === GameStatusEnum.RabbitsSet) {
      if (game.isCreator) {
        if (game.isScCreated) {
          TgButtons?.showMainButton(onCreateBattle, {
            color: colors.pink400,
            text_color: colors.black,
            text: "Verify and shot with Sign",
            is_active: false,
          });
        } else {
          TgButtons?.showMainButton(onCreateBattle, {
            color: colors.pink400,
            text_color: colors.black,
            text: `Sent ${game.bet}`,
            is_active: game.opponent.isInRoom,
          });
        }
      } else {
        TgButtons?.showMainButton(onCreateBattle, {
          color: colors.pink400,
          text_color: colors.black,
          text: `Sent ${game.bet}`,
          is_active: game.isScCreated,
        });
      }
    }
  }, [game.isScCreated, game.opponent]);

  const prizePool = Number(game?.bet) + Number(game?.bet) * 0.99;
  return (
    <main className={s.main}>
      <Box className={s.headerWrapper}>
        <Text className={s.header} weight="bold">
          BunnyBattle
        </Text>
        <Image
          src={"/reload.svg"}
          alt={"reload"}
          width={26}
          height={26}
          className={s.reloadIcon}
          //onClick={() => $doLoadActiveGames({ jwtToken })}
        />
      </Box>
      <Flex
        className={s.namesPrizeWrapper}
        direction="column"
        align="center"
        justify="center"
      >
        <Flex className={s.usenamesWrapper} align="center">
          <UsernameBox
            isActive={false}
            username={
              WebApp?.initDataUnsafe.user?.username
                ? WebApp?.initDataUnsafe.user?.username
                : "You"
            }
            isUser={true}
          />
          <Text className={s.swordEmoji} weight="bold">
            ⚔
          </Text>
          <UsernameBox
            isActive={false}
            username={
              game?.opponent?.userName ? game.opponent.userName : "opponent"
            }
            isUser={false}
          />
        </Flex>
        <Text className={s.prizeOf}>for prize of</Text>
        <Text className={s.prize}>{prizePool} ETH</Text>
      </Flex>
      <Field game={game as IGame} onChangeGame={setGame} />
    </main>
  );
}
