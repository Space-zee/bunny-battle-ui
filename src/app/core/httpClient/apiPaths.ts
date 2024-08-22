export const apiPaths = {
  getUserData(): string {
    return "/getUserData";
  },
  getActiveGames(): string {
    return "/getActiveGames";
  },
  getUserEndedGames(): string {
    return "/getUserEndedGames";
  },
  createGame(): string {
    return "/createGame";
  },
  deleteGame(): string {
    return "/deleteGame";
  },
  withdrawFunds(): string {
    return "/withdrawFunds";
  },
  getGameData(roomId: string): string {
    return `/getGameData/${roomId}`;
  },
  getGameResult(roomId: string): string {
    return `/getGameResult/${roomId}`;
  },
  getEstimatedGasCost(): string {
    return "/getEstimatedGasCost";
  },
};
