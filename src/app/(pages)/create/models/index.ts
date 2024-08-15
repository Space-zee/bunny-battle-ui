import { atom } from "jotai/index";
import { httpClient } from "@/app/core/httpClient";
import { ICreateGameReq, ICreateGameRes } from "@/app/shared/types";
import { apiPaths } from "@/app/core/httpClient/apiPaths";
import { $notification } from "@/app/core/models";
import { NotificationTitleIcon } from "@/app/shared/enums";

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
        set($notification, {
          titleIcon: NotificationTitleIcon.Error,
          isOpen: true,
          title: "An error occurred",
          description: { text: response.error },
        });
        return response;
      }
    }
  },
);
