export interface IGetUserEndedGameRes {
  bet: string;
  roomId: number;
  winner: {
    username: string;
  };
  loser: {
    username: string;
  };
  lastTxHash: string;
}
