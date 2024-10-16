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
import { coordinatesToIndex, formatValue } from "@/app/shared/utils";
import { networks } from "@/app/shared/configs/networks";
import { ChainIdEnum } from "@/app/shared/enums";
import { Field } from "@/app/(pages)/gameEnd/components";
import { getStepsByUsers } from "@/app/(pages)/gameEnd/utils";

export default function GameEndController() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomId = searchParams.get("roomId");

  const [WebApp] = useAtom(coreModels.$webApp);
  const [TgButtons] = useAtom(coreModels.$tgButtons);
  const [gameResult] = useAtom(gameEndModels.$gameResult);
  const [userData] = useAtom(coreModels.$userData);
  const [nativePrice] = useAtom(coreModels.$nativePrice);

  const $doLoadWebApp = useSetAtom(coreModels.$doLoadWebApp);
  const $doLoadGameResult = useSetAtom(gameEndModels.$doLoadGameResult);

  const stepsByUsers = getStepsByUsers(
    gameResult.steps,
    WebApp?.initDataUnsafe.user?.id as number,
  );

  useEffect(() => {
    $doLoadWebApp();
    if (TgButtons) {
      TgButtons.hideBackButton();
      TgButtons.showMainButton(
        () => {
          router.push(`/main`);
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
      roomId: roomId as string,
    });
  }, []);

  return (
    <main className={s.main}>
      {!gameResult.winner ? (
        <Loader />
      ) : (
        <Flex className={s.wrapper}>
          {userData?.wallet.toLowerCase() ===
          gameResult.winner.toLowerCase() ? (
            <Box className={s.headerWrapper}>
              <Flex direction="column" align={"center"} className={s.header}>
                <Text className={s.resEmoji}>🎉</Text>
                <Text className={s.resHeader}>Grats, You won!</Text>
              </Flex>
              <Box className={s.prizePoolWrapper}>
                <Text className={s.youGot}>You got</Text>
                <br />
                <Text className={s.prizePool}>
                  {gameResult.prize} ETH{" "}
                  <span className={s.prizeUsd}>
                    ≈ $
                    {formatValue(
                      String(Number(gameResult.prize) * nativePrice),
                    )}
                  </span>
                </Text>
                <Flex className={s.fieldsWrapper}>
                  <Field
                    steps={stepsByUsers.opponent}
                    username={"Your"}
                    opponentBoard={false}
                  />
                  <Field
                    steps={stepsByUsers.user}
                    username={
                      stepsByUsers.opponent.length
                        ? `@${stepsByUsers.opponent[0].username}`
                        : "Opponent"
                    }
                    opponentBoard={true}
                  />
                </Flex>
              </Box>
              <Box className={s.gameIdHeader}>
                <span className={s.gameId}>#{gameResult.gameId}</span>{" "}
                BunnyBattle History
              </Box>
            </Box>
          ) : (
            <Box className={s.headerWrapper}>
              <Flex direction="column" align={"center"} className={s.header}>
                <Text className={s.resEmoji}>😔</Text>
                <Text className={s.resHeader}>Ops, You lose</Text>
              </Flex>
              <Box className={s.prizePoolWrapper}></Box>
              <Flex className={s.fieldsWrapper}>
                <Field
                  steps={stepsByUsers.opponent}
                  username={"Your"}
                  opponentBoard={false}
                />
                <Field
                  steps={stepsByUsers.user}
                  username={
                    stepsByUsers.opponent.length
                      ? `@${stepsByUsers.opponent[0].username}`
                      : "Opponent"
                  }
                  opponentBoard={true}
                />
              </Flex>
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
                {userData?.wallet.toLowerCase() ===
                gameResult.winner.toLowerCase()
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
                {coordinatesToIndex({ x: el.x, y: el.y }) + 1} cell
              </Text>
            )}
          </Box>
          <Flex
            align="center"
            className={s.openTx}
            onClick={() =>
              WebApp?.openLink(
                `${networks[process.env.CHAIN_ID as unknown as ChainIdEnum].explorer}tx/${el.hash}`,
              )
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
