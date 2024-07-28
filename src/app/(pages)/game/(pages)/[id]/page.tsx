import React, { Suspense } from "react";
import { Loader } from "@/app/components";
import GameController from "@/app/(pages)/game/controllers/GameController";

export default function Game() {
  return (
    <Suspense fallback={<Loader />}>
      <GameController />
    </Suspense>
  );
}
