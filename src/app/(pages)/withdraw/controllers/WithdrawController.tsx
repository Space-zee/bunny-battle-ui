"use client";

import s from "./styles.module.scss";
import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAtom, useSetAtom } from "jotai";
import * as coreModels from "@/app/core/models";
import * as createModels from "../models";
import { colors } from "@/app/shared/constants";
import Image from "next/image";
import { Box } from "@radix-ui/themes";
import clsx from "clsx";

export default function WithdrawController() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const jwtToken = searchParams.get("token");

  const [TgButtons] = useAtom(coreModels.$tgButtons);
  const [WebApp] = useAtom(coreModels.$webApp);
  const [userWallet] = useAtom(coreModels.$userWallet);

  const $doLoadWebApp = useSetAtom(coreModels.$doLoadWebApp);
  const $doCreateGame = useSetAtom(createModels.$doCreateGame);

  useEffect(() => {
    $doLoadWebApp();
    if (TgButtons) {
      TgButtons.showBackButton(() => {
        router.push(`/games?token=${jwtToken}`);
      });
    }
  }, [WebApp]);

  return (
    <main className={s.main}>
      <Avatar
        image={WebApp?.initDataUnsafe.user?.photo_url}
        username={WebApp?.initDataUnsafe.user?.username}
      />
    </main>
  );
}

const Avatar = ({ image, username }: { image?: string; username?: string }) => {
  return (
    <Box className={clsx(s.avatarWrapper)}>
      {image ? (
        <Image
          className={s.avatar}
          src={image}
          alt={"creatorImage"}
          width={64}
          height={64}
        />
      ) : (
        <Box className={s.defaultAvatar}>{username ? username[0] : "A"}</Box>
      )}
    </Box>
  );
};
