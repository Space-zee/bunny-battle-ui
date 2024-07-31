import { atom } from "jotai/index";
import { httpClient } from "@/app/core/httpClient";
import { ICreateGameReq, ICreateGameRes } from "@/app/shared/types";
import { apiPaths } from "@/app/core/httpClient/apiPaths";
import { $activeGames } from "@/app/(pages)/games/models";
import { $game } from "@/app/(pages)/game/models";

export const $doCreateGame = atom(
  null,
  async (get, set, args: { jwtToken: string | null; bet: string }) => {
    const { jwtToken, bet } = args;
    if (jwtToken) {
      console.log("jwtToken", jwtToken);
      console.log("bet", bet);
      const response = await httpClient.post<ICreateGameReq, ICreateGameRes>(
        apiPaths.createGame(),
        jwtToken,
        { bet },
      );
      if (response.data) {
        set($game, { bet });
        return response;
      } else {
        //TODO:HAndle error
        //set($globalError, { isOpen: true, description: "Unknown Error" });
        return response;
      }
    }
  },
);
