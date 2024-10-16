import { atom } from "jotai";
import { httpClient } from "@/app/core/httpClient";
import { apiPaths } from "@/app/core/httpClient/apiPaths";
import { IGameResultStep } from "@/app/(pages)/gameEnd/types";
import { $notification, $webApp } from "@/app/core/models";
import { NotificationTitleIcon } from "@/app/shared/enums";

interface IGameResult {
  steps: IGameResultStep[];
  winner: string;
  gameId: number;
  prize: string;
}

export const $gameResult = atom<IGameResult>({
  steps: [],
  winner: "",
  gameId: 1,
  prize: "0.001",
});

export const $doLoadGameResult = atom(
  null,
  async (get, set, args: { roomId: string }) => {
    const { roomId } = args;
    const initData = get($webApp)?.initData;
    if (initData) {
      const response = await httpClient.get<IGameResult>(
        apiPaths.game.result(roomId),
        initData,
      );
      if (response.data) {
        set($gameResult, {
          steps: response.data.steps,
          winner: response.data.winner,
          gameId: response.data.gameId,
          prize: response.data.prize,
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
