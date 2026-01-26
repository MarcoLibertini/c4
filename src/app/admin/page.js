"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAdminSession from "./_session";

export default function AdminIndex() {
  const router = useRouter();
  const { ready, logged } = useAdminSession();

  useEffect(() => {
    if (!ready) return;
    router.replace(logged ? "/admin/products" : "/admin/login");
  }, [ready, logged, router]);

  return null;
}
