import s from "./style.module.scss";
import clsx from "clsx";
import { Flex, Box, Text } from "@radix-ui/themes";
import React from "react";
import { IGetUserEndedGameRes } from "@/app/shared/types/getUserEndedGames";
import { formatBalance } from "@/app/shared/utils";

type EndedGameProps = {
  endedGame: IGetUserEndedGameRes;
  onLinkClick: () => void;
};

export const EndedGame = ({ endedGame, onLinkClick }: EndedGameProps) => {
  const prizePool = Number(endedGame.bet) * 2 * 0.99;
  return (
    <Flex className={clsx(s.root)} direction="column" align="start">
      <Flex justify="between" className={clsx(s.userWrapper, s.loser)}>
        <Flex align="center">
          <Text>@{endedGame.loser.username}</Text>
          {endedGame.loser.firstMove && (
            <Flex align="center" justify="center" className={s.firstMove}>
              1 mover
            </Flex>
          )}
        </Flex>
        <Text className={s.loserEth}>
          -{formatBalance(Number(endedGame.bet))} ETH
        </Text>
      </Flex>
      <Box className={s.roomIdWrapper}>
        ⚔ <Text className={s.roomId}>#{endedGame.roomId}</Text>
      </Box>
      <Flex justify="between" className={clsx(s.userWrapper, s.winner)}>
        <Flex align="center">
          <Text>🏆 @{endedGame.winner.username}</Text>
          {endedGame.winner.firstMove && (
            <Flex align="center" justify="center" className={s.firstMove}>
              1 mover
            </Flex>
          )}
        </Flex>
        <Text onClick={onLinkClick} className={s.winnerEth}>
          +{prizePool} ETH
        </Text>
      </Flex>
    </Flex>
  );
};
