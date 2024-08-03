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
import {
  IJoinRoomRes,
  IRabbitsSetReq,
  IReadyForBattle,
  IUserMoveReq,
  IUserMoveRes,
} from "@/app/core/ws/types";
import { GameStatusEnum, IGame } from "../models";
import { colors } from "@/app/shared/constants";
import { updateLastElement } from "@/app/shared/utils";

export default function GameController() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = useParams<{ id: string }>().id;

  const jwtToken = searchParams.get("token");

  const [WebApp] = useAtom(coreModels.$webApp);
  const [TgButtons] = useAtom(coreModels.$tgButtons);
  const [userWallet] = useAtom(coreModels.$userWallet);
  const [game, setGame] = useAtom(gameModels.$game);

  const $doLoadWebApp = useSetAtom(coreModels.$doLoadWebApp);

  const onReadyForBattle = (data: IReadyForBattle) => {
    setGame((prevState) => ({
      ...prevState,
      status: GameStatusEnum.RabbitsSet,
      myRabbits: [],
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
      isScCreated: data.isGameCreated,
      steps: [],
    }));
  };

  const onCreateBattle = () => {
    const res: IRabbitsSetReq = {
      roomId,
      telegramUserId: WebApp?.initDataUnsafe.user?.id as number,
      rabbits: game.myRabbits,
    };
    socket.emit(SocketEvents.ClientRabbitsSet, res);
    TgButtons?.mainButton.showProgress();
  };

  const onLeaveRoom = () => {
    setGame((prevState) => ({
      ...prevState,
      opponent: { isInRoom: false, steps: [] },
    }));
  };

  const onJoinRoomRes = (data: IJoinRoomRes) => {
    setGame((prevState) => ({
      ...prevState,
      myRabbits: [],
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

  const onGameCreated = () => {
    setGame((prevState) => ({
      ...prevState,
      isScCreated: true,
    }));
    TgButtons?.mainButton.hideProgress();
  };

  const onGameStarted = () => {
    setGame((prevState) => ({
      ...prevState,
      status: prevState.isCreator
        ? GameStatusEnum.UserTurn
        : GameStatusEnum.OpponentTurn,
    }));
    TgButtons?.mainButton.hideProgress();
    TgButtons?.showMainButton(onMove, {
      color: colors.pink400,
      text_color: colors.black,
      text: "Verify and shot with Sign",
      is_active: false,
    });
  };

  const onMove = () => {
    console.log("game onMove Before", game);
    if (game.currentStep) {
      TgButtons?.mainButton.showProgress();
      const data: IUserMoveReq = {
        roomId,
        telegramUserId: WebApp?.initDataUnsafe.user?.id as number,
        userRabbits: game.myRabbits,
        coordinates: game.currentStep,
      };
      socket.emit(SocketEvents.ClientUserMove, data);
      setGame((prevState) => ({
        ...prevState,
        steps: [
          ...prevState.steps,
          {
            x: prevState.currentStep!.x,
            y: prevState.currentStep!.y,
            isHit: undefined,
          },
        ],
        currentStep: undefined,
      }));
    }
  };

  const onServerUserMove = (data: IUserMoveRes) => {
    console.log("data onServerUserMove", data);
    console.log("game onServerUserMove", game);
    TgButtons?.mainButton.hideProgress();
    if (data.lastMove) {
      if (data.telegramUserId !== (WebApp?.initDataUnsafe.user?.id as number)) {
        setGame((prevState) => {
          // Clone the steps array
          const updatedSteps = [...prevState.steps];

          // Update the last element's `isHit` property
          if (updatedSteps.length > 0) {
            const lastIndex = updatedSteps.length - 1;
            updatedSteps[lastIndex] = {
              ...updatedSteps[lastIndex], // Spread existing properties
              isHit: data.lastMove?.isHit, // Update `isHit` property
            };
          }

          return {
            ...prevState,
            steps: updatedSteps, // Set updated steps array
          };
        });
      } else {
        setGame((prevState) => ({
          ...prevState,
          opponent: {
            ...prevState.opponent,
            steps: [
              ...prevState.opponent.steps,
              {
                x: data.lastMove!.x,
                y: data.lastMove!.y,
                isHit: data.lastMove?.isHit,
              },
            ],
          },
        }));
      }

      console.log("game onServerUserMove", game);
    }

    if (data.telegramUserId === (WebApp?.initDataUnsafe.user?.id as number)) {
      setGame((prevState) => ({
        ...prevState,
        status: GameStatusEnum.OpponentTurn,
      }));
    } else {
      setGame((prevState) => ({
        ...prevState,
        status: GameStatusEnum.UserTurn,
      }));
    }
  };

  const onWinner = (data: { address: string }) => {
    TgButtons?.mainButton.hideProgress();
    const isWinner = userWallet?.wallet === data.address;
    //router.push(`/gameEnd?winner=${isWinner}`);
    console.log("winner", isWinner);
  };

  useEffect(() => {
    socket.on(`${SocketEvents.JoinRoomServer}:${roomId}`, onJoinRoomRes);
    socket.on(`${SocketEvents.ReadyForBattle}:${roomId}`, onReadyForBattle);
    socket.on(`${SocketEvents.GameCreated}:${roomId}`, onGameCreated);
    socket.on(`${SocketEvents.GameStarted}:${roomId}`, onGameStarted);
    socket.on(`${SocketEvents.ServerUserMove}:${roomId}`, onServerUserMove);
    socket.on(`${SocketEvents.Winner}:${roomId}`, onWinner);
    socket.on(`${SocketEvents.LeaveRoomServer}:${roomId}`, onLeaveRoom);

    return () => {
      socket.off(`${SocketEvents.JoinRoomServer}:${roomId}`, onJoinRoomRes);
      socket.off(`${SocketEvents.ReadyForBattle}:${roomId}`, onReadyForBattle);
      socket.off(`${SocketEvents.GameCreated}:${roomId}`, onGameCreated);
      socket.off(`${SocketEvents.GameStarted}:${roomId}`, onGameStarted);
      socket.off(`${SocketEvents.ServerUserMove}:${roomId}`, onServerUserMove);
      socket.off(`${SocketEvents.Winner}:${roomId}`, onWinner);
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
    console.log("onGameChange");
    if (game.status === GameStatusEnum.RabbitsSet) {
      if (game.isCreator) {
        if (game.isScCreated) {
          TgButtons?.showMainButton(onMove, {
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
            is_active: game.opponent.isInRoom && game.myRabbits.length === 2,
          });
        }
      } else {
        TgButtons?.showMainButton(onCreateBattle, {
          color: colors.pink400,
          text_color: colors.black,
          text: `Sent ${game.bet}`,
          is_active: game.isScCreated && game.myRabbits.length === 2,
        });
      }
    } else if (game.status === GameStatusEnum.UserTurn) {
      TgButtons?.showMainButton(onMove, {
        color: colors.pink400,
        text_color: colors.black,
        text: "Verify and shot with Sign",
        is_active: true,
      });
    } else if (game.status === GameStatusEnum.OpponentTurn) {
      TgButtons?.showMainButton(onMove, {
        color: colors.pink400,
        text_color: colors.black,
        text: "Verify and shot with Sign",
        is_active: false,
      });
    }
  }, [TgButtons, game, onCreateBattle, onMove]);

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
