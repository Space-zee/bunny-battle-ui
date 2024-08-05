"use client";

import s from "./styles.module.scss";
import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAtom, useSetAtom } from "jotai/index";
import * as coreModels from "@/app/core/models";
import { colors } from "@/app/shared/constants";

export default function GameEndController() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const jwtToken = searchParams.get("token");
  const isWinner = Boolean(Number(searchParams.get("winner")));

  const [WebApp] = useAtom(coreModels.$webApp);
  const [TgButtons] = useAtom(coreModels.$tgButtons);

  const $doLoadWebApp = useSetAtom(coreModels.$doLoadWebApp);

  useEffect(() => {
    $doLoadWebApp();
    if (TgButtons) {
      TgButtons.hideBackButton();
      TgButtons.showMainButton(
        () => {
          router.push(`/games?token=${jwtToken}`);
        },
        {
          color: colors.white,
          text_color: colors.black,
          text: "Back to Lobby",
          is_active: true,
        },
      );
    }
  }, [WebApp]);

  return <main className={s.main}>{isWinner ? "Winner" : "Loser"}</main>;
}
