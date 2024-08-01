import { ICoordinatesWithHit } from "@/app/shared/types";

export const updateLastElement = (
  arr: ICoordinatesWithHit[],
  isHit: boolean,
): ICoordinatesWithHit[] => {
  if (arr.length === 0) {
    return [];
  }

  const newArr = [...arr];

  newArr[newArr.length - 1] = {
    ...newArr[newArr.length - 1],
    isHit,
  };

  return newArr;
};
