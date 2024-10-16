export interface IGameResultStep {
  x: number;
  y: number;
  isHit: boolean;
  hash: string;
  telegramUserId: number;
  username: string;
}

export interface IGameResultStepForField {
  x: number;
  y: number;
  isHit: boolean;
  isLastMove: boolean;
  hash: string;
  telegramUserId: number;
  username: string;
}
