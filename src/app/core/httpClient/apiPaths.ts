export const apiPaths = {
  user: {
    data(): string {
      return "/user/data";
    },
    endedGames(): string {
      return "/user/ended-games";
    },
  },
  activeGames(): string {
    return "/active-games";
  },
  game: {
    default(): string {
      return "/game";
    },
    data(roomId: string): string {
      return `/game/data/${roomId}`;
    },
    result(roomId: string): string {
      return `/game/result/${roomId}`;
    },
    estimate(): string {
      return `/game/estimate`;
    },
  },
  ethPrice(): string {
    return "/eth-price";
  },
  withdrawFunds(): string {
    return "/withdraw";
  },
};
