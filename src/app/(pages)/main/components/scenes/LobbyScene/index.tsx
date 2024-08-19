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
                onEnterGame={() => onEnterGame(el.roomId)}
              />
            ))
          : userEndedGames.map((el, index) => (
              <EndedGame key={index} endedGame={el} />
            ))}
      </Flex>
    </Flex>
  );
};
