import { atom } from "jotai/index";
import { ICoordinates, ICoordinatesWithHit } from "@/app/shared/types";

export enum GameStatusEnum {
  RabbitsSet = "rabbitsSet",
  UserTurn = "userTurn",
  OpponentTurn = "opponentTurn",
}

export interface IGame {
  gameId: number;
  moveDeadline: number;
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
  moveDeadline: 0,
  gameId: 1,
  myRabbits: [],
  steps: [],
  status: GameStatusEnum.UserTurn,
  isScCreated: false,
  opponent: {
    isInRoom: false,
    steps: [],
  },
});
