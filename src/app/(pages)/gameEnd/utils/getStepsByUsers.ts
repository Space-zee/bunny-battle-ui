import { IGameResultStep } from "@/app/(pages)/gameEnd/types";

export const getStepsByUsers = (
  steps: IGameResultStep[],
  telegramUserId: number,
): { user: IGameResultStep[]; opponent: IGameResultStep[] } => {
  if (!steps.length) {
    return { opponent: [], user: [] };
  }

  const userStepFirst = steps[0].telegramUserId === telegramUserId;

  return {
    user: steps.filter((step, i) =>
      userStepFirst ? i % 2 === 0 : i % 2 !== 0,
    ),
    opponent: steps.filter((step, i) =>
      userStepFirst ? i % 2 !== 0 : i % 2 === 0,
    ),
  };
};
