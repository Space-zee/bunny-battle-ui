import { ICoordinates, ICoordinatesWithHit } from "@/app/shared/types";

export interface IJoinRoomReq {
  roomId: string;
  telegramUserId: number;
}

export interface IJoinRoomRes {
  gameId: number;
  isGameCreated: boolean;
  bet: string;
  roomId: string;
  creatorName: string;
  opponentName?: string;
  roomCreatorId: number;
}

export interface IReadyForBattle {
  gameId: number;
  isGameCreated: boolean;
  bet: string;
  roomId: string;
  creatorName: string;
  opponentName: string;
  roomCreatorId: number;
}

export interface IRabbitsSetReq {
  rabbits: ICoordinates[];
  telegramUserId: number;
  roomId: string;
}

export interface IUserMoveReq {
  roomId: string;
  telegramUserId: number;
  coordinates: ICoordinates;
  userRabbits: ICoordinates[];
}

export interface IUserMoveRes {
  moveDeadline: number;
  lastMove: ICoordinatesWithHit | null;
  telegramUserId: number;
}
