import { atom } from "jotai/index";
import { WebApp as WebAppTypes } from "@twa-dev/types";

interface ICoordinates {
  x: number;
  y: number;
}

interface ICoordinatesWithHit {
  x: number;
  y: number;
  isHit: boolean;
}

interface IGame {
  isCreator: boolean;
  bet: string;
  myRabbits: ICoordinates[];
  steps: ICoordinatesWithHit[];
  opponent: {
    steps: ICoordinatesWithHit[];
    userName: string;
  };
}

export const $game = atom<IGame | null>(null);
