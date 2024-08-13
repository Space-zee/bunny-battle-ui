import s from "./style.module.scss";
import { Box, Flex, Text } from "@radix-ui/themes";
import Image from "next/image";
import { Switcher } from "@/app/components";
import React, { useState } from "react";
import { Game } from "@/app/(pages)/games/components/Game";
import { WebApp } from "@twa-dev/types";
import { IGetActiveGamesRes } from "@/app/shared/types";

type WithdrawSceneProps = {
  WebApp: WebApp;
};

export const WithdrawScene = ({ WebApp }: WithdrawSceneProps) => {
  return <Box className={s.root}>WithdrawScene</Box>;
};
