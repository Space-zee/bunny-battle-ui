"use client";
import s from "./style.module.scss";
import { Box, Flex } from "@radix-ui/themes";
import { CellStatusEnum } from "@/app/shared/enums";
import { QuestionMarkIcon } from "@/app/components";
import clsx from "clsx";

type CellProps = {
  id: number;
  status: CellStatusEnum;
};

const cellInnerConfig: Partial<Record<CellStatusEnum, string | JSX.Element>> = {
  [CellStatusEnum.Set]: "🐇",
  [CellStatusEnum.Killed]: "❌🐇",
  [CellStatusEnum.OpponentDefault]: <QuestionMarkIcon width={12} height={22} />,
  [CellStatusEnum.OpponentShot]: <QuestionMarkIcon width={12} height={22} />,
  [CellStatusEnum.Missed]: "⭕",
};

export const Cell = ({ status, id }: CellProps) => {
  return (
    <Flex
      className={clsx(
        s.root,
        status === CellStatusEnum.Set && s.set,
        status === CellStatusEnum.Verify && s.verify,
        status === CellStatusEnum.OpponentDefault && s.opponentDefault,
        status === CellStatusEnum.OpponentShot && s.opponentShot,
      )}
      justify="between"
    >
      <Box>{id}</Box>
      <Box className={s.value}>{cellInnerConfig[status]}</Box>
      <Box />
    </Flex>
  );
};
