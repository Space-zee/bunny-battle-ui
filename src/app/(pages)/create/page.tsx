import React, { Suspense } from "react";
import { Loader } from "@/app/components";
import CreateController from "@/app/(pages)/create/controllers/CreateController";

export default function Game() {
  return (
    <Suspense fallback={<Loader />}>
      <CreateController />
    </Suspense>
  );
}
