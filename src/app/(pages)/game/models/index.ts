import { atom } from "jotai/index";
import { ICoordinates, ICoordinatesWithHit } from "@/app/shared/types";

export enum GameStatusEnum {
  RabbitsSet = "rabbitsSet",
  UserTurn = "userTurn",
  OpponentTurn = "opponentTurn",
}

export interface IGame {
  isScCreated: boolean;
  status?: GameStatusEnum;
  isCreator?: boolean;
  bet?: string;
  myRabbits: ICoordinates[];
  steps: ICoordinatesWithHit[];
  currentStep?: ICoordinates;
  opponent: {
    isInRoom: boolean;
    steps: ICoordinatesWithHit[];
    userName?: string;
  };
}

export const $game = atom<IGame>({
  myRabbits: [],
  steps: [],
  status: GameStatusEnum.RabbitsSet,
  isScCreated: false,
  opponent: {
    isInRoom: false,
    steps: [],
  },
});
