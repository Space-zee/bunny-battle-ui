"use client";

import s from "./styles.module.scss";
import React, { useEffect, useState } from "react";
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
import { IReadyForBattle } from "@/app/core/ws/types";

export default function GameController() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = useParams<{ id: string }>().id;

  const jwtToken = searchParams.get("token");

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [WebApp] = useAtom(coreModels.$webApp);
  const [TgButtons] = useAtom(coreModels.$tgButtons);
  const [game, setGame] = useAtom(gameModels.$game);

  const $doLoadWebApp = useSetAtom(coreModels.$doLoadWebApp);
  const onConnect = () => {
    setIsConnected(true);
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };

  const onReadyForBattle = (data: IReadyForBattle) => {
    console.log("data", data);
    setGame(() => ({
      isCreator:
        data.roomCreatorId === (WebApp?.initDataUnsafe.user?.id as number),
      myRabbits: [],
      bet: data.bet,
      opponent: {
        steps: [],
        userName:
          data.roomCreatorId === (WebApp?.initDataUnsafe.user?.id as number)
            ? data.opponentName
            : data.creatorName,
      },
      steps: [],
    }));
  };

  useEffect(() => {
    socket.on(SocketEvents.Connect, onConnect);
    socket.on(SocketEvents.Disconnect, onDisconnect);
    socket.on(`${SocketEvents.ReadyForBattle}:${roomId}`, onReadyForBattle);

    return () => {
      socket.off(SocketEvents.Connect, onConnect);
      socket.off(SocketEvents.Disconnect, onDisconnect);
    };
  }, []);

  useEffect(() => {
    $doLoadWebApp();
    if (TgButtons) {
      TgButtons.showBackButton(() => {
        router.push("/games");
      });
    }
    joinRoom({
      roomId,
      telegramUserId: WebApp?.initDataUnsafe.user?.id as number,
    });
  }, []);

  return (
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
            username={game ? game.opponent.userName : "opponent"}
            isUser={false}
          />
        </Flex>
        <Text className={s.prizeOf}>for prize of</Text>
        <Text className={s.prize}>0.0002 ETH</Text>
      </Flex>
      <Field />
    </main>
  );
}
