import React, { Suspense } from "react";
import { Loader } from "@/app/components";
import MainController from "@/app/(pages)/main/controllers/MainController";

export default function Main() {
  return (
    <Suspense fallback={<Loader />}>
      <MainController />
    </Suspense>
  );
}
