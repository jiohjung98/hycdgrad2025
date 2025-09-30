"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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

  // 로딩 중일 때는 아무것도 표시하지 않음
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 인증되지 않은 경우 비밀번호 입력 화면 표시 (개발용으로 임시 비활성화)
  // if (!isAuthenticated) {
  //   return <PasswordProtection onAuthenticated={handleAuthenticated} />;
  // }

  // 랜딩페이지인 경우 헤더/푸터 없이 컨텐츠만 표시
  if (pathname === "/commingsoon") {
    return <>{children}</>;
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
