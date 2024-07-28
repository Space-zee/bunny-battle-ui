export interface IJoinRoomReq {
  roomId: string;
  telegramUserId: number;
}

export interface IReadyForBattle {
  bet: string;
  roomId: string;
  creatorName: string;
  opponentName: string;
  roomCreatorId: number;
}
