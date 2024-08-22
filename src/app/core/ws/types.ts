import { ICoordinates, ICoordinatesWithHit } from "@/app/shared/types";
import { RoomStatusServerEnum } from "@/app/shared/enums";

export interface IJoinRoomReq {
  roomId: string;
  telegramUserId: number;
}

export interface IJoinRoomRes {
  telegramUserId: number;
  gameId: number;
  isGameCreated: boolean;
  status: RoomStatusServerEnum;
  bet: string;
  roomId: string;
  creatorName: string;
  creatorPhoto: string;
  joinerName?: string;
  joinerPhoto: string;
  roomCreatorId: number;
}

export interface IReadyForBattle {
  gameId: number;
  isGameCreated: boolean;
  bet: string;
  roomId: string;
  creatorName: string;
  creatorPhoto: string;
  joinerName: string;
  joinerPhoto: string;
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
