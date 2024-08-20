import { atom } from "jotai/index";
import { httpClient } from "@/app/core/httpClient";
import { IGetActiveGamesRes } from "@/app/shared/types";
import { apiPaths } from "@/app/core/httpClient/apiPaths";
import { IGetUserEndedGameRes } from "@/app/shared/types/getUserEndedGames";
import { ChainIdEnum, NotificationTitleIcon } from "@/app/shared/enums";
import { $notification, $webApp } from "@/app/core/models";
import { colors } from "@/app/shared/constants";
import { networks } from "@/app/shared/configs/networks";

export const $activeGames = atom<IGetActiveGamesRes[]>([]);
export const $userEndedGames = atom<IGetUserEndedGameRes[]>([]);

export const $doLoadActiveGames = atom(null, async (get, set) => {
  const initData = get($webApp)?.initData;
  if (initData) {
    const response = await httpClient.get<IGetActiveGamesRes[]>(
      apiPaths.getActiveGames(),
      initData,
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
});

export const $doLoadUserEndedGames = atom(null, async (get, set) => {
  const initData = get($webApp)?.initData;

  if (initData) {
    const response = await httpClient.get<IGetUserEndedGameRes[]>(
      apiPaths.getUserEndedGames(),
      initData,
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
});

export const $doDeleteGame = atom(
  null,
  async (get, set, args: { roomId: string }) => {
    const { roomId } = args;
    const initData = get($webApp)?.initData;

    if (initData) {
      const response = await httpClient.post(apiPaths.deleteGame(), initData, {
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
  async (get, set, args: { amount: string; to: string }) => {
    const { amount, to } = args;
    const initData = get($webApp)?.initData;
    if (initData) {
      const response = await httpClient.post<
        { amount: string; toAddress: string },
        { txHash: string }
      >(apiPaths.withdrawFunds(), initData, {
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
            link: `${networks[process.env.CHAIN_ID as unknown as ChainIdEnum].explorer}tx/${response.data?.txHash}`,
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
