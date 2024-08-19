import s from "./style.module.scss";
import { Box, Text, Flex } from "@radix-ui/themes";
import React from "react";
import Image from "next/image";

type LeaderboardSceneProps = {};

export const LeaderboardScene = ({}: LeaderboardSceneProps) => {
  return (
    <Box className={s.root}>
      Leaderboard <br />
      <Box className={s.boxBorder}>
        <Flex
          className={s.box}
          direction="column"
          align="center"
          justify="center"
        >
          <Image src={"/brain.svg"} alt={"Brain"} width={72} height={72} />
          <Text className={s.comingSoon}>Coming soon...</Text>
        </Flex>
      </Box>
    </Box>
  );
};
