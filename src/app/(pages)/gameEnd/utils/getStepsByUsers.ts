import {
  IGameResultStep,
  IGameResultStepForField,
} from "@/app/(pages)/gameEnd/types";

export const getStepsByUsers = (
  steps: IGameResultStep[],
  telegramUserId: number,
): { user: IGameResultStepForField[]; opponent: IGameResultStepForField[] } => {
  if (!steps.length) {
    return { opponent: [], user: [] };
  }

  const userStepFirst = steps[0].telegramUserId === telegramUserId;
  const stepsForField: IGameResultStepForField[] = steps.map((step, i) => {
    if (i === steps.length - 1) {
      return { ...step, isLastMove: true };
    } else {
      return { ...step, isLastMove: false };
    }
  });

  return {
    user: stepsForField.filter((step, i) =>
      userStepFirst ? i % 2 === 0 : i % 2 !== 0,
    ),
    opponent: stepsForField.filter((step, i) =>
      userStepFirst ? i % 2 !== 0 : i % 2 === 0,
    ),
  };
};
