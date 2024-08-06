import { atom } from "jotai";
import { httpClient } from "@/app/core/httpClient";
import { apiPaths } from "@/app/core/httpClient/apiPaths";
import { IGameResultStep } from "@/app/(pages)/gameEnd/types";

export const $gameResult = atom<{
  steps: IGameResultStep[];
  winner: string;
  gameId: number;
}>({
  steps: [],
  winner: "",
  gameId: 1,
});

export const $doLoadGameResult = atom(
  null,
  async (get, set, args: { jwtToken: string | null; roomId: string }) => {
    const { jwtToken, roomId } = args;
    if (jwtToken) {
      const response = await httpClient.get<{
        steps: IGameResultStep[];
        winnerAddress: string;
        gameId: number;
      }>(apiPaths.getGameResult(roomId), jwtToken);
      if (response.data) {
        set($gameResult, {
          steps: response.data.steps,
          winner: response.data.winnerAddress,
          gameId: response.data.gameId,
        });
      } else {
        //TODO:HAndle error
        //set($globalError, { isOpen: true, description: "Unknown Error" });
      }
    }
  },
);
