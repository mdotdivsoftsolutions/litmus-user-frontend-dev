"use client";

import { UserLayout } from "@/components/layout/UserLayout";
import { Suspense } from "react";
import UserLoading from "./loading";

export default function UserGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<UserLoading />}>
      <UserLayout>{children}</UserLayout>
    </Suspense>
  );
}
