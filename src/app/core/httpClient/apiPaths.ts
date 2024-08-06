export const apiPaths = {
  getUserWallet(): string {
    return "/api/getUserWallet";
  },
  getActiveGames(): string {
    return "/api/getActiveGames";
  },
  createGame(): string {
    return "/api/createGame";
  },
  deleteGame(): string {
    return "/api/deleteGame";
  },
  getGameData(roomId: string): string {
    return `/api/getGameData/${roomId}`;
  },
  getGameResult(roomId: string): string {
    return `/api/getGameResult/${roomId}`;
  },
};
