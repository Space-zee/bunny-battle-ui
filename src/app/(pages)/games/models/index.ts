import { atom } from "jotai/index";
import { httpClient } from "@/app/core/httpClient";
import { IGetActiveGamesRes } from "@/app/shared/types";
import { apiPaths } from "@/app/core/httpClient/apiPaths";
import { IGetUserEndedGameRes } from "@/app/shared/types/getUserEndedGames";

export const $activeGames = atom<IGetActiveGamesRes[]>([]);
export const $userEndedGames = atom<IGetUserEndedGameRes[]>([]);

export const $doLoadActiveGames = atom(
  null,
  async (get, set, args: { jwtToken: string | null }) => {
    const { jwtToken } = args;
    if (jwtToken) {
      const response = await httpClient.get<IGetActiveGamesRes[]>(
        apiPaths.getActiveGames(),
        jwtToken,
      );
      if (response.data) {
        set($activeGames, response.data);
      } else {
        //TODO:HAndle error
        //set($globalError, { isOpen: true, description: "Unknown Error" });
      }
    }
  },
);

export const $doLoadUserEndedGames = atom(
  null,
  async (get, set, args: { jwtToken: string | null }) => {
    const { jwtToken } = args;
    if (jwtToken) {
      const response = await httpClient.get<IGetUserEndedGameRes[]>(
        apiPaths.getUserEndedGames(),
        jwtToken,
      );
      if (response.data) {
        set($userEndedGames, response.data);
      } else {
        //TODO:HAndle error
        //set($globalError, { isOpen: true, description: "Unknown Error" });
      }
    }
  },
);

export const $doDeleteGame = atom(
  null,
  async (get, set, args: { jwtToken: string | null; roomId: string }) => {
    const { jwtToken, roomId } = args;
    if (jwtToken) {
      const response = await httpClient.post(apiPaths.deleteGame(), jwtToken, {
        roomId,
      });
      if (response.success) {
      } else {
        //TODO:HAndle error
        //set($globalError, { isOpen: true, description: "Unknown Error" });
      }
    }
  },
);
