import s from "./style.module.scss";
import clsx from "clsx";
import { Flex, Text, Button } from "@radix-ui/themes";
import { IGetActiveGamesRes } from "@/app/shared/types";
import { WebApp } from "@twa-dev/types";

type GameProps = {
  game: IGetActiveGamesRes;
  onClick: () => void;
  webApp: WebApp;
};

export const Game = ({ game, onClick, webApp }: GameProps) => {
  const isUserGame = webApp.initDataUnsafe.user?.id === game.creatorId;
  return (
    <Flex className={clsx(s.root)} justify="between" align="center">
      {isUserGame ? (
        <Text className={s.ownGame}>You</Text>
      ) : (
        <Text className={s.userName}>@{game.username}</Text>
      )}
      <Flex className={s.betWithButton}>
        <Text className={s.emoji}>⚔</Text>{" "}
        <Text className={s.bet}>{game.bet} ETH</Text>
        <Button onClick={onClick} className={s.button}>
          {isUserGame ? "Back to my battle" : "Fight"}
        </Button>
      </Flex>
    </Flex>
  );
};
