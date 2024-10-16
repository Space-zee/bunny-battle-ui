import s from "./style.module.scss";
import { Box, Flex, Text } from "@radix-ui/themes";
import Image from "next/image";
import { Switcher } from "@/app/components";
import React, { useState } from "react";
import { Game } from "@/app/(pages)/main/components/Game";
import { WebApp } from "@twa-dev/types";
import { IGetActiveGamesRes } from "@/app/shared/types";
import { IGetUserEndedGameRes } from "@/app/shared/types/getUserEndedGames";
import { EndedGame } from "@/app/(pages)/main/components/EndedGame";
import { motion } from "framer-motion";
import {
  getBalanceDeficitForFee,
  isEnoughBalanceForFee,
} from "@/app/(pages)/utils";
import { formatBalance } from "@/app/shared/utils";
import { ChainIdEnum, NotificationTitleIcon } from "@/app/shared/enums";
import { useAtom } from "jotai/index";
import * as coreModels from "@/app/core/models";
import { networks } from "@/app/shared/configs/networks";

type LobbySceneProps = {
  activeGames: IGetActiveGamesRes[];
  userEndedGames: IGetUserEndedGameRes[];
  WebApp: WebApp;
  nativePrice: number;
  onReload: () => void;
  onDeleteGame: (roomId: string) => void;
  onEnterGame: (roomId: string) => void;
};

export const LobbyScene = ({
  onReload,
  onDeleteGame,
  WebApp,
  activeGames,
  onEnterGame,
  userEndedGames,
  nativePrice,
}: LobbySceneProps) => {
  const [gamesTab, setGamesTab] = useState("active");

  const [userData] = useAtom(coreModels.$userData);
  const [estimatedGameGasCost] = useAtom(coreModels.$estimatedGameGasCost);

  const [, setNotification] = useAtom(coreModels.$notification);
  const onEndedGameLinkClick = (hash: string) => {
    WebApp.openLink(
      `${networks[process.env.CHAIN_ID as unknown as ChainIdEnum].explorer}tx/${hash}`,
    );
  };

  return (
    <Flex className={s.root} direction="column" align="center" justify="center">
      <motion.div
        whileTap={{ scale: 0.9 }}
        className={s.headerWrapper}
        onClick={onReload}
      >
        <Text className={s.header} weight="bold">
          Combat lobby
        </Text>
        <Image src={"/reload.svg"} alt={"reload"} width={26} height={26} />
      </motion.div>
      <Switcher
        activeTab={gamesTab}
        tabs={[
          { id: "active", label: "Active" },
          { id: "ended", label: "Ended" },
        ]}
        onSetActiveTab={setGamesTab}
      />
      <Flex className={s.gamesWrapper} direction="column" gap="3">
        {gamesTab === "active" ? (
          activeGames.length ? (
            activeGames.map((el, index) => (
              <Game
                nativePrice={nativePrice}
                key={index}
                webApp={WebApp}
                game={el}
                onDeleteGame={() => onDeleteGame(el.roomId)}
                onEnterGame={() => {
                  if (
                    !isEnoughBalanceForFee(
                      el.bet,
                      estimatedGameGasCost?.estimatedGameGasCost || "0",
                      userData?.balance || "0",
                    )
                  ) {
                    const deficit = formatBalance(
                      getBalanceDeficitForFee(
                        el.bet,
                        estimatedGameGasCost?.estimatedGameGasCost || "0",
                        userData?.balance || "0",
                      ),
                    );
                    setNotification({
                      isOpen: true,
                      titleIcon: NotificationTitleIcon.Warning,
                      title: "Insufficient Funds",
                      description: {
                        text: `Please deposit at least <strong>${deficit} ETH</strong> to cover transaction fees and proceed with this bet, or lower the bet amount.`,
                      },
                    });
                  } else {
                    onEnterGame(el.roomId);
                  }
                }}
              />
            ))
          ) : (
            <Box className={s.boxBorder}>
              <Flex
                className={s.box}
                direction="column"
                align="center"
                justify="center"
              >
                <Image
                  src={"/bunny.svg"}
                  alt={"bunny"}
                  width={72}
                  height={72}
                />
                <Text className={s.noActiveBattles}>
                  No active battles for now
                </Text>
              </Flex>
            </Box>
          )
        ) : (
          userEndedGames.map((el, index) => (
            <EndedGame
              key={index}
              endedGame={el}
              onLinkClick={() => onEndedGameLinkClick(el.lastTxHash)}
            />
          ))
        )}
      </Flex>
    </Flex>
  );
};
