import React, { Suspense } from "react";
import { Loader } from "@/app/components";

export default function Test() {
  return <Suspense fallback={<Loader />}>TEST</Suspense>;
}
