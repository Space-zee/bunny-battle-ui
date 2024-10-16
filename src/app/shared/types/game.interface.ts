import { GameStatusEnum } from "@/app/shared/enums";

export interface IGame {
  isDisableField: boolean;
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
    photo?: string;
  };
}

export interface ICoordinates {
  x: number;
  y: number;
}

export interface ICoordinatesWithHit {
  x: number;
  y: number;
  isHit?: boolean;
}
