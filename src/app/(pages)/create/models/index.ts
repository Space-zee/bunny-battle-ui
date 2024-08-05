import { atom } from "jotai/index";
import { httpClient } from "@/app/core/httpClient";
import { ICreateGameReq, ICreateGameRes } from "@/app/shared/types";
import { apiPaths } from "@/app/core/httpClient/apiPaths";

export const $doCreateGame = atom(
  null,
  async (get, set, args: { jwtToken: string | null; bet: string }) => {
    const { jwtToken, bet } = args;
    if (jwtToken) {
      const response = await httpClient.post<ICreateGameReq, ICreateGameRes>(
        apiPaths.createGame(),
        jwtToken,
        { bet },
      );
      if (response.data) {
        return response;
      } else {
        //TODO:HAndle error
        //set($globalError, { isOpen: true, description: "Unknown Error" });
        return response;
      }
    }
  },
);
