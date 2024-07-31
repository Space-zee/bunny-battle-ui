import { atom } from "jotai/index";
import { WebApp as WebAppTypes } from "@twa-dev/types";

interface ICoordinates {
  x: number;
  y: number;
}

interface ICoordinatesWithHit {
  x: number;
  y: number;
  isHit?: boolean;
}

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
  myRabbits: [
    { x: 1, y: 1 },
    { x: 2, y: 2 },
  ],
  steps: [{ x: 1, y: 2, isHit: true }],
  status: GameStatusEnum.UserTurn,
  isScCreated: false,
  opponent: {
    isInRoom: false,
    steps: [],
  },
});
