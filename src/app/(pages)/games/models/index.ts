import { atom } from "jotai/index";
import { httpClient } from "@/app/core/httpClient";
import { IGetActiveGamesRes } from "@/app/shared/types";
import { apiPaths } from "@/app/core/httpClient/apiPaths";
import { IGetUserEndedGameRes } from "@/app/shared/types/getUserEndedGames";
import { NotificationTitleIcon } from "@/app/shared/enums";
import { $notification } from "@/app/core/models";
import { colors } from "@/app/shared/constants";

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

export const $doWithdraw = atom(
  null,
  async (
    get,
    set,
    args: { jwtToken: string | null; amount: string; to: string },
  ) => {
    const { jwtToken, amount, to } = args;
    if (jwtToken) {
      const response = await httpClient.post<
        { amount: string; toAddress: string },
        { txHash: string }
      >(apiPaths.withdrawFunds(), jwtToken, {
        amount,
        toAddress: to,
      });
      if (response.success) {
        set($notification, {
          titleIcon: NotificationTitleIcon.Success,
          isOpen: true,
          title: "Transaction confirmed",
          description: {
            text: response.data?.txHash,
            link: `https://sepolia.scrollscan.com/tx/${response.data?.txHash}`,
            color: colors.pink400,
          },
        });
      } else {
        set($notification, {
          titleIcon: NotificationTitleIcon.Error,
          isOpen: true,
          title: "An error occurred",
          description: { text: response.error },
        });
      }
      return true;
    }
  },
);
