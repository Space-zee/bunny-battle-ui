import s from "./style.module.scss";
import clsx from "clsx";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { IGetActiveGamesRes } from "@/app/shared/types";
import { WebApp } from "@twa-dev/types";
import Image from "next/image";
import { RoomStatusServerEnum } from "@/app/shared/enums";
import { MaximizeIcon } from "@/app/components";
import React from "react";

type GameProps = {
  game: IGetActiveGamesRes;
  onEnterGame: () => void;
  onDeleteGame: (roomId: string) => void;
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
                  image={game.creator.photo}
                  username={game.creator.username}
                  isActive={true}
                />
                <Box>⚔</Box>
                <Avatar
                  image={game.joiner?.photo}
                  username={game.joiner?.username}
                  isActive={false}
                />
                <Text className={s.userName}>@{game.joiner?.username}</Text>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Avatar
                  image={game.joiner?.photo}
                  username={game.joiner?.username}
                  isActive={true}
                />
                <Box>⚔</Box>
                <Avatar
                  image={game.creator.photo}
                  username={game.creator.username}
                  isActive={false}
                />
                <Text className={s.userName}>@{game.creator.username}</Text>
              </React.Fragment>
            )}
          </Flex>
        ) : (
          <Flex align="center">
            <Avatar
              image={game.creator.photo}
              username={game.creator.username}
              isActive={isUserGame}
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
                onClick={() => onDeleteGame(game.roomId)}
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

const Avatar = ({
  isActive,
  image,
  username,
}: {
  isActive: boolean;
  image?: string;
  username?: string;
}) => {
  return (
    <Box className={clsx(s.avatarWrapper, isActive && s.isUser)}>
      {image ? (
        <Image
          className={s.avatar}
          src={image}
          alt={"creatorImage"}
          width={32}
          height={32}
        />
      ) : (
        <Box className={s.defaultAvatar}>{username ? username[0] : "A"}</Box>
      )}
    </Box>
  );
};
