export const storageKeys = {
  rabbits: (gameId: string): string => {
    console.log(gameId);
    return `rabbits_${gameId}`;
  },
};
