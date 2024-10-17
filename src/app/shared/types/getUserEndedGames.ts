export interface IGetUserEndedGameRes {
  bet: string;
  roomId: number;
  winner: {
    username: string;
    firstMove: boolean;
  };
  loser: {
    username: string;
    firstMove: boolean;
  };
  lastTxHash: string;
}
