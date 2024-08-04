'use client'

import React, { Suspense, useState } from "react";
import { Loader } from "@/app/components";
import BottomNavBar from "@/app/components/bottomNav/molecule/BottomNavBar";
import { Flex } from "@radix-ui/themes";
import s from "./pageWrapper.module.scss"

export default function KC() {

  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    console.log('Avatar clicked!');
    setIsActive(prev => !prev);
  };

  return (
    <Suspense fallback={<Loader />}>
      <Flex className={s.wrapper}>
      <BottomNavBar />
      </Flex>
    </Suspense>
  );
}