import { atom } from "jotai";
import { httpClient } from "@/app/core/httpClient";
import { apiPaths } from "@/app/core/httpClient/apiPaths";
import { IGameResultStep } from "@/app/(pages)/gameEnd/types";
import { $notification, $webApp } from "@/app/core/models";
import { NotificationTitleIcon } from "@/app/shared/enums";

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
  async (get, set, args: { roomId: string }) => {
    const { roomId } = args;
    const initData = get($webApp)?.initData;
    if (initData) {
      const response = await httpClient.get<{
        steps: IGameResultStep[];
        winnerAddress: string;
        gameId: number;
      }>(apiPaths.getGameResult(roomId), initData);
      if (response.data) {
        set($gameResult, {
          steps: response.data.steps,
          winner: response.data.winnerAddress,
          gameId: response.data.gameId,
        });
      } else {
        set($notification, {
          titleIcon: NotificationTitleIcon.Error,
          isOpen: true,
          title: "An error occurred",
          description: { text: response.error },
        });
      }
    }
  },
);
