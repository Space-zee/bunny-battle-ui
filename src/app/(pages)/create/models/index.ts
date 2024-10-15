import { atom } from "jotai/index";
import { httpClient } from "@/app/core/httpClient";
import { ICreateGameReq, ICreateGameRes } from "@/app/shared/types";
import { apiPaths } from "@/app/core/httpClient/apiPaths";
import { $notification, $webApp } from "@/app/core/models";
import { NotificationTitleIcon } from "@/app/shared/enums";

export const $doCreateGame = atom(
  null,
  async (get, set, args: { bet: string }) => {
    const { bet } = args;
    const initData = get($webApp)?.initData;
    if (initData) {
      const response = await httpClient.post<ICreateGameReq, ICreateGameRes>(
        apiPaths.game.default(),
        initData,
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
