"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "../header";
import Footer from "../footer";
import MouseBubbles from './MouseBubbles';
import PasswordProtection from "./PasswordProtection";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // 세션 스토리지에서 인증 상태 확인
    const authStatus = sessionStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }

    // "/" 경로로 접속 시 무조건 /commingsoon으로 이동
    if (pathname === "/") {
      router.replace("/commingsoon");
    }

    setIsLoading(false);
  }, [pathname, router]);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // /commingsoon은 인증 없이 바로 렌더링
  if (pathname === "/commingsoon" || pathname === "/") {
    return <>{children}</>;
  }

  // 다른 경로는 인증 체크
  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={handleAuthenticated} />;
  }

  return (
    <>
      <MouseBubbles />
      <Header />
      {children}
      <Footer />
    </>
  );
}
