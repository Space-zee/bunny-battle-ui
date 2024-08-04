import React, { Suspense } from "react";
import { Loader } from "@/app/components";
import BattleHistoryController from "@/app/(pages)/battleHistory/controllers/BattleHistoryController"

export default function BattleHistory() {
  // return <div>Battle History Page</div>;
  return (
    <Suspense fallback={<Loader />}>
      <BattleHistoryController />
    </Suspense>
  );
}