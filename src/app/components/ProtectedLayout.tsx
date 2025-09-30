"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "../header";
import Footer from "../footer";
// import MouseBubbles from './MouseBubbles';
import PasswordProtection from "./PasswordProtection";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // landing 페이지는 헤더/푸터 없이 독립적으로 표시
  const isLandingPage = pathname === "/landing";

  useEffect(() => {
    // 세션 스토리지에서 인증 상태 확인
    const authStatus = sessionStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  // landing 페이지는 레이아웃 없이 바로 렌더링
  if (isLandingPage) {
    return <>{children}</>;
  }

  // 로딩 중일 때는 아무것도 표시하지 않음
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 인증되지 않은 경우 비밀번호 입력 화면 표시
  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={handleAuthenticated} />;
  }

  // 인증된 경우 원래 레이아웃 표시
  return (
    <>
      {/* <MouseBubbles /> */}
      <Header />
      {children}
      <Footer />
    </>
  );
}
