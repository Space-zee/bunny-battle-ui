"use client";
import s from "./style.module.scss";
import { Box, Flex } from "@radix-ui/themes";
import { CellStatusEnum } from "@/app/shared/enums";
import { QuestionMarkIcon } from "@/app/components";
import clsx from "clsx";
import { useMemo } from "react";
import { GameStatusEnum, IGame } from "@/app/(pages)/game/models";
import {
  compareCoordinates,
  gridIndexToCoordinates,
} from "@/app/shared/utils/math";

type CellProps = {
  index: number;
  game: IGame;
  onChangeGame: any;
};

const cellInnerConfig: Partial<Record<CellStatusEnum, string | JSX.Element>> = {
  [CellStatusEnum.Set]: "🐇",
  [CellStatusEnum.Killed]: "❌🐇",
  [CellStatusEnum.OpponentDefault]: <QuestionMarkIcon width={12} height={22} />,
  [CellStatusEnum.OpponentShot]: <QuestionMarkIcon width={12} height={22} />,
  [CellStatusEnum.Missed]: "⭕",
};

export const Cell = ({ index, onChangeGame, game }: CellProps) => {
  const cellState: CellStatusEnum = useMemo(() => {
    const cellCoordinates = gridIndexToCoordinates(index);

    // const moveByCoordinates = game.steps?.find((move) =>
    //   compareCoordinates(cellCoordinates, { x: move.x, y: move.y }),
    // );
    if (game.status === GameStatusEnum.RabbitsSet) {
      if (!game.isScCreated) {
        if (
          game.myRabbits?.find((item) =>
            compareCoordinates(item, cellCoordinates),
          )
        ) {
          return CellStatusEnum.Set;
        }
      } else if (!game.isCreator) {
        if (
          game.myRabbits?.find((item) =>
            compareCoordinates(item, cellCoordinates),
          )
        ) {
          return CellStatusEnum.Set;
        }
      }
      return CellStatusEnum.Default;
    }

    if (game.status === GameStatusEnum.OpponentTurn) {
      const res = game.opponent.steps.find((item) =>
        compareCoordinates(item, cellCoordinates),
      );
      if (res) {
        if (res.isHit) {
          return CellStatusEnum.Killed;
        } else {
          return CellStatusEnum.Missed;
        }
      }

      if (
        game.myRabbits.find((item) => compareCoordinates(item, cellCoordinates))
      ) {
        return CellStatusEnum.Set;
      }
    }

    if (game.status === GameStatusEnum.UserTurn) {
      const res = game.steps.find((item) =>
        compareCoordinates(item, cellCoordinates),
      );
      if (res) {
        if (res.isHit === undefined) {
          return CellStatusEnum.Verify;
        } else if (res.isHit) {
          return CellStatusEnum.Killed;
        } else {
          return CellStatusEnum.Missed;
        }
      } else if (
        game.currentStep &&
        compareCoordinates(game.currentStep, cellCoordinates)
      ) {
        return CellStatusEnum.OpponentShot;
      }

      return CellStatusEnum.OpponentDefault;
    }

    return CellStatusEnum.Disabled;
  }, [game.myRabbits, game.status, game.currentStep, index, game.opponent]);

  const onClick = (index: number) => {
    if (game.status === GameStatusEnum.RabbitsSet) {
      const defaultBehaviour = () => {
        if (game.myRabbits?.length === 2) {
          if (
            !compareCoordinates(
              game.myRabbits[1],
              gridIndexToCoordinates(index),
            )
          ) {
            onChangeGame((prevState: IGame) => ({
              ...prevState,
              myRabbits: [
                prevState.myRabbits[1],
                gridIndexToCoordinates(index),
              ],
            }));
          }
        } else {
          onChangeGame((prevState: IGame) => ({
            ...prevState,
            myRabbits: [...prevState.myRabbits, gridIndexToCoordinates(index)],
          }));
        }
      };
      if (!game.isScCreated) {
        defaultBehaviour();
      } else if (!game.isCreator) {
        defaultBehaviour();
      }
    }

    if (game.status === GameStatusEnum.UserTurn) {
      const cellCoordinates = gridIndexToCoordinates(index);
      const res = game.steps.find((item) =>
        compareCoordinates(item, cellCoordinates),
      );
      if (!res) {
        onChangeGame((prevState: IGame) => ({
          ...prevState,
          currentStep: gridIndexToCoordinates(index),
        }));
      }
    }
  };

  return (
    <Flex
      className={clsx(
        s.root,
        cellState === CellStatusEnum.Disabled && s.disabled,
        cellState === CellStatusEnum.Set && s.set,
        cellState === CellStatusEnum.Verify && s.verify,
        cellState === CellStatusEnum.OpponentDefault && s.opponentDefault,
        cellState === CellStatusEnum.OpponentShot && s.opponentShot,
      )}
      justify="between"
      onClick={() => onClick(index)}
    >
      <Box>{index}</Box>
      <Box className={s.value}>{cellInnerConfig[cellState]}</Box>
      <Box />
    </Flex>
  );
};
