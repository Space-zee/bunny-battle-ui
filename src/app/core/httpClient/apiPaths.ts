export const apiPaths = {
  getUserWallet(): string {
    return "/getUserWallet";
  },
  getActiveGames(): string {
    return "/getActiveGames";
  },
  createGame(): string {
    return "/createGame";
  },
  deleteGame(): string {
    return "/deleteGame";
  },
  getGameData(roomId: string): string {
    return `/getGameData/${roomId}`;
  },
  getGameResult(roomId: string): string {
    return `/getGameResult/${roomId}`;
  },
};
