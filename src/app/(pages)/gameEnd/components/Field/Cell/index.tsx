"use client";
import s from "./style.module.scss";
import { Box, Flex } from "@radix-ui/themes";
import { CellStatusEnum } from "@/app/shared/enums";
import { QuestionMarkIcon } from "@/app/components";
import clsx from "clsx";
import {
  compareCoordinates,
  gridIndexToCoordinates,
} from "@/app/shared/utils/math";
import { IGameResultStep } from "@/app/(pages)/gameEnd/types";

type CellProps = {
  index: number;
  steps: IGameResultStep[];
  opponentBoard: boolean;
};

const cellInnerConfig: Partial<Record<CellStatusEnum, string | JSX.Element>> = {
  [CellStatusEnum.Killed]: "❌🐇",
  [CellStatusEnum.OpponentDefault]: <QuestionMarkIcon width={12} height={16} />,
  [CellStatusEnum.Missed]: "⭕",
};

export const Cell = ({ index, steps, opponentBoard }: CellProps) => {
  const getCellState = () => {
    const cellCoordinates = gridIndexToCoordinates(index);
    const res = steps.find((item) => compareCoordinates(item, cellCoordinates));
    if (res) {
      if (res.isHit) {
        return CellStatusEnum.Killed;
      } else {
        return CellStatusEnum.Missed;
      }
    }
    if (opponentBoard) {
      return CellStatusEnum.OpponentDefault;
    }
    return CellStatusEnum.Default;
  };
  const cellState = getCellState();
  return (
    <Flex
      className={clsx(
        s.root,
        cellState === CellStatusEnum.OpponentDefault && s.opponentDefault,
      )}
      justify="between"
    >
      <Box>{index + 1}</Box>
      <Box className={s.value}>{cellInnerConfig[cellState]}</Box>
      <Box />
    </Flex>
  );
};
