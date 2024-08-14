import WebApp from "@twa-dev/sdk";
import { WebApp as WebAppTypes } from "@twa-dev/types";
import { TgButtons } from "@/app/shared/utils/TgButtons.class";
import { atom } from "jotai";
import { httpClient } from "@/app/core/httpClient";
import { IUserData } from "@/app/shared/types";
import { apiPaths } from "@/app/core/httpClient/apiPaths";
import { TgStorage } from "@/app/shared/utils";

export const $webApp = atom<WebAppTypes | null>(null);
export const $tgButtons = atom<TgButtons | null>(null);
export const $tgStorage = atom<TgStorage | null>(null);

export const $userData = atom<IUserData | null>(null);

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

export const $doLoadUserData = atom(
  null,
  async (get, set, args: { jwtToken: string | null }) => {
    const { jwtToken } = args;
    if (jwtToken) {
      const response = await httpClient.get<IUserData>(
        apiPaths.getUserData(),
        jwtToken,
      );
      if (response.data) {
        set($userData, response.data);
      } else {
        //TODO:HAndle error
        //set($globalError, { isOpen: true, description: "Unknown Error" });
      }
    }
  },
);
