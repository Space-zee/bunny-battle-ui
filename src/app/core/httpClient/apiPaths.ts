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
  getGameData(roomId: string): string {
    return `/getGameData/${roomId}`;
  },
};
