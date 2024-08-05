import React, { Suspense } from "react";
import { Loader } from "@/app/components";
import GameEndController from "@/app/(pages)/gameEnd/controllers/GameEndController";

export default function GameEnd() {
  return (
    <Suspense fallback={<Loader />}>
      <GameEndController />
    </Suspense>
  );
}
