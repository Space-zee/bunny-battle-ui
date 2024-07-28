import React, { Suspense } from "react";
import { Loader } from "@/app/components";
import GamesController from "@/app/(pages)/games/controllers/GamesController";

export default function Games() {
  return (
    <Suspense fallback={<Loader />}>
      <GamesController />
    </Suspense>
  );
}
