"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../utils/auth";

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    if (getToken()) {
      router.push("/dashboard");
    } else {
      router.push("/signin");
    }
  }, [router]);
  return null;
}

