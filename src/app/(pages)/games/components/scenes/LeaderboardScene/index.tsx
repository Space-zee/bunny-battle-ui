import s from "./style.module.scss";
import { Box, Text } from "@radix-ui/themes";
import React from "react";

type LeaderboardSceneProps = {};

export const LeaderboardScene = ({}: LeaderboardSceneProps) => {
  return (
    <Box className={s.root}>
      Leaderboard <br />
      <span className={s.comingSoon}>(Coming soon)</span>
    </Box>
  );
};
