"use client";

import s from "./styles.module.scss";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAtom, useSetAtom } from "jotai";
import * as coreModels from "@/app/core/models";
import * as gameModels from "../models";
import { GameStatusEnum, IGame } from "../models";
import { Field } from "../components/Field";
import { Box, Flex, Text } from "@radix-ui/themes";
import Image from "next/image";
import { UsernameBox } from "@/app/(pages)/game/components";
import { socket } from "@/app/core/ws/socket";
import { SocketEvents } from "@/app/core/ws/constants";
import {
  IJoinRoomReq,
  IJoinRoomRes,
  IRabbitsSetReq,
  IReadyForBattle,
  IUserMoveReq,
  IUserMoveRes,
} from "@/app/core/ws/types";
import { colors, storageKeys } from "@/app/shared/constants";
import Countdown from "react-countdown";
import { Loader } from "@/app/components";
import {
  NotificationTitleIcon,
  RoomStatusServerEnum,
} from "@/app/shared/enums";
import { ICoordinates } from "@/app/shared/types";

export default function GameController() {
  const router = useRouter();
  const roomId = useParams<{ id: string }>().id;

  const [WebApp] = useAtom(coreModels.$webApp);
  const [TgButtons] = useAtom(coreModels.$tgButtons);
  const [TgStorage] = useAtom(coreModels.$tgStorage);
  const [, setNotification] = useAtom(coreModels.$notification);
  const [, setSecondNotification] = useAtom(coreModels.$secondNotification);
  const [game, setGame] = useAtom(gameModels.$game);
  const $doLoadGameData = useSetAtom(gameModels.$doLoadGameData);
  const prizePool = Number(game?.bet) * 2 * 0.99;

  const $doLoadWebApp = useSetAtom(coreModels.$doLoadWebApp);

  const onReadyForBattle = (data: IReadyForBattle) => {
    setGame((prevState) => ({
      ...prevState,
      gameId: data.gameId,
      status: GameStatusEnum.RabbitsSet,
      isCreator:
        data.roomCreatorId === (WebApp?.initDataUnsafe.user?.id as number),
      bet: data.bet,
      opponent: {
        steps: [],
        userName:
          data.roomCreatorId === (WebApp?.initDataUnsafe.user?.id as number)
            ? data.isGameCreated
              ? undefined
              : data.joinerName
            : data.creatorName,
        photo:
          data.roomCreatorId === (WebApp?.initDataUnsafe.user?.id as number)
            ? data.isGameCreated
              ? undefined
              : data.joinerPhoto
            : data.creatorPhoto,
        isInRoom: true,
      },
      isScCreated: data.isGameCreated,
      steps: [],
    }));
  };

  const onCreateBattle = () => {
    if (!TgButtons?.mainButton.isProgressVisible) {
      const res: IRabbitsSetReq = {
        roomId,
        telegramUserId: WebApp?.initDataUnsafe.user?.id as number,
        rabbits: game.myRabbits,
      };
      setGame((prevState) => ({ ...prevState, isDisableField: true }));
      socket.emit(SocketEvents.ClientRabbitsSet, res);
      TgStorage?.saveInfo(
        WebApp?.initDataUnsafe.user?.id as number,
        storageKeys.rabbits(game.gameId.toString()),
        game.myRabbits,
      );
      TgButtons?.mainButton.showProgress();
    }
  };

  const joinRoom = (data: IJoinRoomReq) => {
    socket.emit(SocketEvents.JoinRoomClient, data);
  };

  const onLeaveRoom = () => {
    setGame((prevState) => {
      if (prevState.status === GameStatusEnum.RabbitsSet) {
        setSecondNotification({
          isOpen: true,
          text: `@${prevState.opponent.userName}`,
          image: prevState.opponent.photo,
          type: "leaved",
        });
        return {
          ...prevState,
          opponent: {
            userName: undefined,
            steps: [],
            isInRoom: false,
            photo: undefined,
          },
        };
      }
      return {
        ...prevState,
        opponent: {
          ...prevState.opponent,
          isInRoom: false,
        },
      };
    });
  };

  const onJoinRoomRes = async (data: IJoinRoomRes) => {
    if (
      data.telegramUserId !== (WebApp?.initDataUnsafe.user?.id as number) &&
      !data.isGameCreated
    ) {
      setSecondNotification({
        isOpen: true,
        text: `@${
          (data.roomCreatorId === (WebApp?.initDataUnsafe.user?.id as number)
            ? data.joinerName
            : data.creatorName) as string
        }`,
        image:
          data.roomCreatorId === (WebApp?.initDataUnsafe.user?.id as number)
            ? data.joinerPhoto
            : data.creatorPhoto,
        type: "joined",
      });
    }

    if (data.status === RoomStatusServerEnum.Active) {
      setGame({
        isDisableField: false,
        moveDeadline: 0,
        status: GameStatusEnum.RabbitsSet,
        isScCreated: data.isGameCreated,
        gameId: data.gameId,
        myRabbits: [],
        isCreator:
          data.roomCreatorId === (WebApp?.initDataUnsafe.user?.id as number),
        bet: data.bet,
        opponent: {
          steps: [],
          userName:
            data.roomCreatorId === (WebApp?.initDataUnsafe.user?.id as number)
              ? data.joinerName
              : data.creatorName,
          photo:
            data.roomCreatorId === (WebApp?.initDataUnsafe.user?.id as number)
              ? data.joinerPhoto
              : data.creatorPhoto,
          isInRoom: false,
        },
        steps: [],
      });
    } else if (data.status === RoomStatusServerEnum.WaitingGameJoin) {
      const myRabbits = (await TgStorage?.getInfo(
        WebApp?.initDataUnsafe.user?.id as number,
        storageKeys.rabbits(data.gameId.toString()),
      )) as ICoordinates[];
      setGame({
        isDisableField: false,
        moveDeadline: 0,
        status: GameStatusEnum.RabbitsSet,
        isScCreated: data.isGameCreated,
        gameId: data.gameId,
        myRabbits: myRabbits || [],
        isCreator:
          data.roomCreatorId === (WebApp?.initDataUnsafe.user?.id as number),
        bet: data.bet,
        opponent: {
          steps: [],
          userName:
            data.roomCreatorId === (WebApp?.initDataUnsafe.user?.id as number)
              ? data.joinerName
              : data.creatorName,
          isInRoom: true,
        },
        steps: [],
      });
    } else if (data.status === RoomStatusServerEnum.Game) {
      if (data.telegramUserId === (WebApp?.initDataUnsafe.user?.id as number)) {
        await $doLoadGameData({ roomId });
      }
    } else {
      router.push(`/main`);
    }
  };

  const onGameCreated = () => {
    setGame((prevState) => ({
      ...prevState,
      isScCreated: true,
      isDisableField: false,
    }));
    TgButtons?.mainButton.hideProgress();
  };

  const onGameStarted = async (data: {
    moveDeadline: number;
    opponentName: string;
    creatorName: string;
    gameId: number;
  }) => {
    const myRabbits = (await TgStorage?.getInfo(
      WebApp?.initDataUnsafe.user?.id as number,
      storageKeys.rabbits(data.gameId.toString()),
    )) as ICoordinates[];
    setGame((prevState) => ({
      ...prevState,
      myRabbits,
      status: prevState.isCreator
        ? GameStatusEnum.UserTurn
        : GameStatusEnum.OpponentTurn,
      moveDeadline: data.moveDeadline,
      opponent: {
        ...prevState.opponent,
        userName: prevState.isCreator ? data.opponentName : data.creatorName,
      },
      isDisableField: false,
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
        isDisableField: true,
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

  const onConfirmWin = () => {
    TgButtons?.mainButton.showProgress();
    socket.emit(SocketEvents.ConfirmWin, {
      roomId,
      telegramUserId: WebApp?.initDataUnsafe.user?.id as number,
    });
  };

  const onServerUserMove = (data: IUserMoveRes) => {
    TgButtons?.mainButton.hideProgress();
    if (data.lastMove) {
      if (data.telegramUserId !== (WebApp?.initDataUnsafe.user?.id as number)) {
        setGame((prevState) => {
          const updatedSteps = [...prevState.steps];

          if (updatedSteps.length > 0) {
            const lastIndex = updatedSteps.length - 1;
            updatedSteps[lastIndex] = {
              ...updatedSteps[lastIndex],
              isHit: data.lastMove?.isHit,
            };
          }

          return {
            ...prevState,
            isDisableField: false,
            steps: updatedSteps,
          };
        });
      } else {
        setGame((prevState) => ({
          ...prevState,
          isDisableField: false,
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
    }

    if (data.telegramUserId === (WebApp?.initDataUnsafe.user?.id as number)) {
      setGame((prevState) => ({
        ...prevState,
        status: GameStatusEnum.OpponentTurn,
        moveDeadline: data.moveDeadline,
        isDisableField: false,
      }));
    } else {
      setGame((prevState) => ({
        ...prevState,
        status: GameStatusEnum.UserTurn,
        moveDeadline: data.moveDeadline,
        isDisableField: false,
      }));
    }
  };

  const onWinner = () => {
    TgButtons?.mainButton.hideProgress();
    TgStorage?.removeValue(
      WebApp?.initDataUnsafe.user?.id as number,
      storageKeys.rabbits(game.gameId.toString()),
    );
    router.push(`/gameEnd?roomId=${roomId}`);
  };

  const onTimerComplete = () => {
    // if (game.status === GameStatusEnum.OpponentTurn) {
    socket.emit(SocketEvents.CheckDeadlineClient, {
      roomId,
      telegramUserId: WebApp?.initDataUnsafe.user?.id as number,
    });
    //}
  };

  const onCheckDeadline = () => {
    console.log("Check deadline");
    setGame((prevState) => {
      if (prevState.status === GameStatusEnum.OpponentTurn) {
        TgButtons?.showMainButton(onConfirmWin, {
          color: colors.pink400,
          text_color: colors.black,
          text: "Confirm Win",
          is_active: true,
        });

        return {
          ...prevState,
          status: GameStatusEnum.UserTurn,
        };
      }
      TgButtons?.showMainButton(onMove, {
        color: colors.pink400,
        text_color: colors.black,
        text: "Verify and shot with Sign",
        is_active: false,
      });
      return {
        ...prevState,
        status: GameStatusEnum.OpponentTurn,
      };
    });
  };

  const onTxFailed = (data: { error: string }) => {
    setGame((prevState) => ({ ...prevState, isDisableField: false }));
    setNotification({
      isOpen: true,
      title: data.error,
      titleIcon: NotificationTitleIcon.Error,
    });
    TgButtons?.mainButton.hideProgress();
  };

  const onAuthError = () => {
    setNotification({
      isOpen: true,
      title: "Authentication error",
      description: { text: "Please reopen web app" },
      titleIcon: NotificationTitleIcon.Error,
    });
  };

  useEffect(() => {
    socket.on(`${SocketEvents.JoinRoomServer}:${roomId}`, onJoinRoomRes);
    socket.on(`${SocketEvents.ReadyForBattle}:${roomId}`, onReadyForBattle);
    socket.on(`${SocketEvents.GameCreated}:${roomId}`, onGameCreated);
    socket.on(`${SocketEvents.GameStarted}:${roomId}`, onGameStarted);
    socket.on(`${SocketEvents.ServerUserMove}:${roomId}`, onServerUserMove);
    socket.on(`${SocketEvents.CheckDeadlineServer}:${roomId}`, onCheckDeadline);
    socket.on(`${SocketEvents.Winner}:${roomId}`, onWinner);
    socket.on(`${SocketEvents.LeaveRoomServer}:${roomId}`, onLeaveRoom);
    socket.on(
      `${SocketEvents.TxFailed}:${roomId}:${WebApp?.initDataUnsafe.user?.id as number}`,
      onTxFailed,
    );
    socket.on(SocketEvents.AuthError, onAuthError);

    return () => {
      socket.off(`${SocketEvents.JoinRoomServer}:${roomId}`, onJoinRoomRes);
      socket.off(`${SocketEvents.ReadyForBattle}:${roomId}`, onReadyForBattle);
      socket.off(`${SocketEvents.GameCreated}:${roomId}`, onGameCreated);
      socket.off(`${SocketEvents.GameStarted}:${roomId}`, onGameStarted);
      socket.off(`${SocketEvents.ServerUserMove}:${roomId}`, onServerUserMove);
      socket.off(`${SocketEvents.Winner}:${roomId}`, onWinner);
      socket.off(`${SocketEvents.LeaveRoomServer}:${roomId}`, onLeaveRoom);
      socket.off(
        `${SocketEvents.TxFailed}:${roomId}:${WebApp?.initDataUnsafe.user?.id as number}`,
        onTxFailed,
      );
      socket.off(SocketEvents.AuthError, onAuthError);

      socket.emit(SocketEvents.LeaveRoomClient, {
        roomId,
        telegramUserId: WebApp?.initDataUnsafe.user?.id as number,
      });
      setGame({
        isDisableField: false,
        moveDeadline: 0,
        gameId: 1,
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
        setGame({
          isDisableField: false,
          moveDeadline: 0,
          gameId: 1,
          myRabbits: [],
          steps: [],
          status: GameStatusEnum.UserTurn,
          isScCreated: false,
          opponent: {
            isInRoom: false,
            steps: [],
          },
        });
        router.push(`/main`);
      });
    }

    joinRoom({
      roomId,
      telegramUserId: WebApp?.initDataUnsafe.user?.id as number,
    });
  }, [WebApp]);

  useEffect(() => {
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
            text: `Sent ${game.bet ? game.bet : 0}`,
            is_active: game.opponent.isInRoom && game.myRabbits.length === 2,
          });
        }
      } else {
        TgButtons?.showMainButton(onCreateBattle, {
          color: colors.pink400,
          text_color: colors.black,
          text: `Sent ${game.bet ? game.bet : 0}`,
          is_active: game.isScCreated && game.myRabbits.length === 2,
        });
      }
    } else if (game.status === GameStatusEnum.UserTurn) {
      if (game.moveDeadline > Number(Date.now())) {
        TgButtons?.showMainButton(onMove, {
          color: colors.pink400,
          text_color: colors.black,
          text: "Verify and shot with Sign",
          is_active: true,
        });
      } else {
        TgButtons?.showMainButton(onMove, {
          color: colors.pink400,
          text_color: colors.black,
          text: "Verify and shot with Sign",
          is_active: false,
        });
      }
    } else if (game.status === GameStatusEnum.OpponentTurn) {
      if (game.moveDeadline > Number(Date.now())) {
        TgButtons?.showMainButton(onMove, {
          color: colors.pink400,
          text_color: colors.black,
          text: "Verify and shot with Sign",
          is_active: false,
        });
      } else {
        TgButtons?.showMainButton(onConfirmWin, {
          color: colors.pink400,
          text_color: colors.black,
          text: "Confirm Win",
          is_active: true,
        });
      }
    }
  }, [game, TgButtons]);

  return game.bet ? (
    <main className={s.main}>
      <Flex className={s.headerWrapper} align={"center"}>
        <Image src={"/gameLogo.svg"} alt={"gameLogo"} width={176} height={48} />
        <Text className={s.gameId}>#{game.gameId}</Text>
        <Image
          src={"/reload.svg"}
          alt={"reload"}
          width={26}
          height={26}
          className={s.reloadIcon}
        />
      </Flex>
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
            {game.status === GameStatusEnum.RabbitsSet ? "⚔" : "🤔"}
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
        <Text className={s.prize}>{prizePool.toFixed(5)} ETH</Text>
      </Flex>

      {game.status !== GameStatusEnum.RabbitsSet && (
        <Flex justify="between" align="center" className={s.timerWrapper}>
          <Text className={s.turn}>
            {game.status === GameStatusEnum.UserTurn
              ? "Your turn"
              : "🤞 Opponent’s turn"}
          </Text>
          <Countdown
            onComplete={() => {
              onTimerComplete();
            }}
            date={game.moveDeadline}
            renderer={(props) => (
              <Box className={s.timer}>
                0:{props.seconds < 10 ? `0${props.seconds}` : props.seconds}
              </Box>
            )}
          />
        </Flex>
      )}
      <Field game={game as IGame} onChangeGame={setGame} />
    </main>
  ) : (
    <Loader />
  );
}
