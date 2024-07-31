export interface IJoinRoomReq {
  roomId: string;
  telegramUserId: number;
}

export interface IJoinRoomRes {
  isGameCreated: boolean;
  bet: string;
  roomId: string;
  creatorName: string;
  opponentName?: string;
  roomCreatorId: number;
}

export interface IReadyForBattle {
  isGameCreated: boolean;
  bet: string;
  roomId: string;
  creatorName: string;
  opponentName: string;
  roomCreatorId: number;
}
