export const storageKeys = {
  rabbits: (gameId: string): string => {
    return `rabbits_${gameId}`;
  },
};
