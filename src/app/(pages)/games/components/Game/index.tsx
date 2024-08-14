import s from "./style.module.scss";
import clsx from "clsx";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { IGetActiveGamesRes } from "@/app/shared/types";
import { WebApp } from "@twa-dev/types";
import Image from "next/image";
import { RoomStatusServerEnum } from "@/app/shared/enums";
import { Avatar, MaximizeIcon } from "@/app/components";
import React from "react";

type GameProps = {
  game: IGetActiveGamesRes;
  onEnterGame: () => void;
  onDeleteGame: () => void;
  webApp: WebApp;
};

export const Game = ({
  game,
  onEnterGame,
  onDeleteGame,
  webApp,
}: GameProps) => {
  const isUserGame =
    webApp.initDataUnsafe.user?.id === game.creator.telegramUserId;
  const isUserJoinGame =
    webApp.initDataUnsafe.user?.id === game.joiner?.telegramUserId;
  const isUserGameStarted =
    (isUserGame || isUserJoinGame) &&
    (game.status === RoomStatusServerEnum.WaitingGameJoin ||
      game.status === RoomStatusServerEnum.Game);
  return (
    <Flex
      className={clsx(s.root, isUserGameStarted && s.gameStarted)}
      direction="column"
      justify="center"
    >
      <Flex align="center" justify="between">
        {isUserGameStarted ? (
          <Flex align="center" className={s.avatarsGameStarted}>
            {isUserGame ? (
              <React.Fragment>
                <Avatar
                  className={s.avatar}
                  photo={game.creator.photo}
                  isActive={true}
                  width={32}
                  height={32}
                />
                <Box>⚔</Box>
                <Avatar
                  className={s.opponentAvatar}
                  photo={game.joiner?.photo as string}
                  isActive={false}
                  width={32}
                  height={32}
                />
                <Text className={s.userName}>@{game.joiner?.username}</Text>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Avatar
                  className={s.avatar}
                  photo={game.joiner?.photo as string}
                  isActive={true}
                  width={32}
                  height={32}
                />
                <Box>⚔</Box>
                <Avatar
                  className={s.opponentAvatar}
                  photo={game.creator.photo}
                  isActive={false}
                  width={32}
                  height={32}
                />
                <Text className={s.userName}>@{game.creator.username}</Text>
              </React.Fragment>
            )}
          </Flex>
        ) : (
          <Flex align="center">
            <Avatar
              className={s.avatar}
              photo={game.creator.photo}
              isActive={isUserGame}
              width={32}
              height={32}
            />
            <Text className={clsx(s.userName, isUserGame && s.isUser)}>
              {isUserGame
                ? "You"
                : `@${game.creator.username ? game.creator.username : "A"}`}
            </Text>
          </Flex>
        )}
        <Flex align="center">
          <Text className={s.bet}>{game.bet} ETH</Text>
          {isUserGameStarted ? (
            ""
          ) : isUserGame ? (
            <Flex className={s.actionsWrapper}>
              <MaximizeIcon
                onClick={onEnterGame}
                className={s.maximize}
                width={24}
                height={24}
                color={"#fff"}
              />

              <Image
                onClick={onDeleteGame}
                className={s.trashIcon}
                src={"/trash.svg"}
                alt={"trash"}
                width={24}
                height={24}
              />
            </Flex>
          ) : (
            <Button onClick={onEnterGame} className={s.fightButton}>
              Fight
            </Button>
          )}
        </Flex>
      </Flex>
      {isUserGameStarted && (
        <Button onClick={onEnterGame} className={s.backToBattleButton}>
          <Text>Back to my Battle</Text>
          <MaximizeIcon color={"#000"} width={20} height={20} />
        </Button>
      )}
    </Flex>
  );
};
