import { atom } from "jotai/index";
import { httpClient } from "@/app/core/httpClient";
import { IGetActiveGamesRes } from "@/app/shared/types";
import { apiPaths } from "@/app/core/httpClient/apiPaths";

export const $activeGames = atom<IGetActiveGamesRes[]>([]);

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
