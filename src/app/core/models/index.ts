import WebApp from "@twa-dev/sdk";
import { WebApp as WebAppTypes } from "@twa-dev/types";
import { TgButtons } from "@/app/shared/utils/TgButtons.class";
import { atom } from "jotai";
import { httpClient } from "@/app/core/httpClient";
import { IUserData } from "@/app/shared/types";
import { apiPaths } from "@/app/core/httpClient/apiPaths";
import { TgStorage } from "@/app/shared/utils";
import { NotificationTitleIcon } from "@/app/shared/enums";
import { GameGasCost } from "@/app/shared/types/gameGasCost.interface";
import { $activeGames } from "@/app/(pages)/main/models";

export const $webApp = atom<WebAppTypes | null>(null);
export const $nativePrice = atom<number>(0);
export const $tgButtons = atom<TgButtons | null>(null);
export const $tgStorage = atom<TgStorage | null>(null);
export const $notification = atom<{
  title: string;
  description?: {
    text?: string;
    link?: string;
    color?: string;
  };
  bottom?: string;
  titleIcon: NotificationTitleIcon;
  isOpen: boolean;
}>({
  titleIcon: NotificationTitleIcon.Copy,
  title: "Alert",
  bottom: undefined,
  isOpen: false,
});

export const $secondNotification = atom<{
  text: string;
  image?: string;
  isOpen: boolean;
  type?: "joined" | "left";
  bottom?: string;
}>({
  text: "A",
  isOpen: false,
});

export const $userData = atom<IUserData | null>(null);
export const $estimatedGameGasCost = atom<GameGasCost | null>(null);

export const $doLoadEthPrice = atom(null, async (get, set) => {
  const initData = get($webApp)?.initData;
  if (initData) {
    const response = await httpClient.get<number>(
      apiPaths.ethPrice(),
      initData,
    );
    if (response.data) {
      set($nativePrice, response.data);
    }
  }
});

export const $doLoadWebApp = atom(null, async (get, set) => {
  const webApp = get($webApp);
  if (!webApp) {
    if (typeof window !== "undefined" && WebApp) {
      set($webApp, WebApp);
      set($tgButtons, new TgButtons(WebApp));
      set($tgStorage, new TgStorage(WebApp));
    } else {
      set($webApp, null);
    }
  }
});

export const $doLoadUserData = atom(null, async (get, set) => {
  const initData = get($webApp)?.initData;
  if (initData) {
    const response = await httpClient.get<IUserData>(
      apiPaths.user.data(),
      initData,
    );
    if (response.data) {
      set($userData, response.data);
      await set($doLoadEthPrice);
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

export const $doLoadEstimatedGameGasCost = atom(null, async (get, set) => {
  const initData = get($webApp)?.initData;
  if (initData) {
    const response = await httpClient.get<GameGasCost>(
      apiPaths.game.estimate(),
      initData,
    );
    if (response.data) {
      set($estimatedGameGasCost, response.data);
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
