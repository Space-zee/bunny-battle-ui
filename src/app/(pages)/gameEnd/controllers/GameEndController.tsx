"use client";

import s from "./styles.module.scss";
import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAtom, useSetAtom } from "jotai/index";
import * as coreModels from "@/app/core/models";
import * as gameEndModels from "../models";
import { colors } from "@/app/shared/constants";
import { Loader } from "@/app/components";
import { Box, Text, Flex } from "@radix-ui/themes";
import Image from "next/image";
import { coordinatesToIndex } from "@/app/shared/utils";

export default function GameEndController() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const jwtToken = searchParams.get("token");
  const roomId = searchParams.get("roomId");

  const [WebApp] = useAtom(coreModels.$webApp);
  const [TgButtons] = useAtom(coreModels.$tgButtons);
  const [gameResult] = useAtom(gameEndModels.$gameResult);
  const [userData] = useAtom(coreModels.$userData);

  const $doLoadWebApp = useSetAtom(coreModels.$doLoadWebApp);
  const $doLoadGameResult = useSetAtom(gameEndModels.$doLoadGameResult);

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

  useEffect(() => {
    $doLoadGameResult({
      jwtToken: jwtToken,
      roomId: roomId as string,
    });
  }, []);

  return (
    <main className={s.main}>
      {!gameResult.steps.length ? (
        <Loader />
      ) : (
        <Flex>
          {userData?.wallet === gameResult.winner ? (
            <Box>
              <Flex
                direction="column"
                align={"center"}
                className={s.headerWrapper}
              >
                <Text className={s.resEmoji}>🎉</Text>
                <Text className={s.resHeader}>
                  Congratulations on your victory
                </Text>
              </Flex>
              <Box className={s.prizePoolWrapper}>
                <Text className={s.youGot}>You got</Text>
                <br />
                <Text className={s.prizePool}>0.11 ETH</Text>
              </Box>
              <Box className={s.gameIdHeader}>
                <span className={s.gameId}>#{gameResult.gameId}</span>{" "}
                BunnyBattle History
              </Box>
            </Box>
          ) : (
            <Box>
              <Flex
                direction="column"
                align={"center"}
                className={s.headerWrapper}
              >
                <Text className={s.resEmoji}>😔</Text>
                <Text
                  className={s.resHeader}
                >{`Don't worry, you'll be lucky next time`}</Text>
              </Flex>
              <Box className={s.prizePoolWrapper}></Box>
              <Box className={s.gameIdHeader}>
                <span className={s.gameId}>#{gameResult.gameId}</span>{" "}
                BunnyBattle History
              </Box>
            </Box>
          )}
        </Flex>
      )}
      {gameResult.steps.map((el, index) => (
        <Flex
          key={el.hash}
          justify="between"
          align="center"
          className={s.txWrapper}
        >
          <Box>
            {gameResult.steps.length - 1 === index ? (
              <Text>
                {userData?.wallet === gameResult.winner
                  ? "🎉 You Win"
                  : "😔 You Lose"}
              </Text>
            ) : (
              <Text>
                {el.isHit ? "❌🐇" : "⭕"}{" "}
                {el.telegramUserId === WebApp?.initDataUnsafe.user?.id
                  ? "You"
                  : `@${el.username}`}{" "}
                <span className={s.firedIn}>fired in</span>{" "}
                {coordinatesToIndex({ x: el.x, y: el.y })} cell
              </Text>
            )}
          </Box>
          <Flex
            align="center"
            className={s.openTx}
            onClick={() =>
              WebApp?.openLink(`https://sepolia.scrollscan.com/tx/${el.hash}`)
            }
          >
            <Text className={s.goToTxn}>go to txn</Text>
            <Image
              src={"/scrollLogo.svg"}
              alt={"scrollLogo"}
              width={13}
              height={13}
            />
          </Flex>
        </Flex>
      ))}
    </main>
  );
}
