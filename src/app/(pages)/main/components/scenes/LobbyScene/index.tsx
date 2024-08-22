import s from "./style.module.scss";
import { Flex, Text } from "@radix-ui/themes";
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
import { NotificationTitleIcon } from "@/app/shared/enums";
import { useAtom } from "jotai/index";
import * as coreModels from "@/app/core/models";

type LobbySceneProps = {
  onReload: () => void;
  onDeleteGame: (roomId: string) => void;
  onEnterGame: (roomId: string) => void;
  activeGames: IGetActiveGamesRes[];
  userEndedGames: IGetUserEndedGameRes[];
  WebApp: WebApp;
};

export const LobbyScene = ({
  onReload,
  onDeleteGame,
  WebApp,
  activeGames,
  onEnterGame,
  userEndedGames,
}: LobbySceneProps) => {
  const [gamesTab, setGamesTab] = useState("active");

  const [userData] = useAtom(coreModels.$userData);
  const [estimatedGameGasCost] = useAtom(coreModels.$estimatedGameGasCost);

  const [, setNotification] = useAtom(coreModels.$notification);

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
        {gamesTab === "active"
          ? activeGames.map((el, index) => (
              <Game
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
          : userEndedGames.map((el, index) => (
              <EndedGame key={index} endedGame={el} />
            ))}
      </Flex>
    </Flex>
  );
};
