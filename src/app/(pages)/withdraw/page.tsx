import React, { Suspense } from "react";
import { Loader } from "@/app/components";
import WithdrawController from "@/app/(pages)/withdraw/controllers/WithdrawController";

export default function Withdraw() {
  return (
    <Suspense fallback={<Loader />}>
      <WithdrawController />
    </Suspense>
  );
}
