"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/comingsoon"); // 깜빡임 없이 리다이렉트
  }, [router]);

  return null; // 화면에는 아무것도 렌더링하지 않음
}
