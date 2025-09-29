"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 메뉴가 열렸을 때 body 스크롤 방지
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // 스크롤 위치 복원
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    // 컴포넌트 언마운트시 스크롤 복원
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="w-full bg-white">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-[70px] md:h-20">
          <div className="flex items-center">
            <Image
              src="/logo.svg"
              alt="HYCD Logo"
              width={54}
              height={45}
              className="w-[54px] h-[45px]"
            />
          </div>
          <nav className="desktop-nav items-center">
            <div className="flex items-center gap-16">
              <Link
                href="/about"
                className={`text-center justify-start text-lg font-bold font-['Pretendard'] tracking-tight hover:opacity-80 transition-opacity cursor-pointer ${
                  pathname === "/about" ? "text-red-500" : "text-cyan-900"
                }`}
                style={{ fontSize: "18pt" }}
              >
                About
              </Link>
              <Link
                href="/projects"
                className={`text-center justify-start text-lg font-bold font-['Pretendard'] tracking-tight hover:opacity-80 transition-opacity cursor-pointer ${
                  pathname === "/projects" ? "text-red-500" : "text-cyan-900"
                }`}
                style={{ fontSize: "18pt" }}
              >
                Projects
              </Link>
              <Link
                href="/designers"
                className={`text-center justify-start text-lg font-bold font-['Pretendard'] tracking-tight hover:opacity-80 transition-opacity cursor-pointer ${
                  pathname === "/designers" ? "text-red-500" : "text-cyan-900"
                }`}
                style={{ fontSize: "18pt" }}
              >
                Designers
              </Link>
            </div>
          </nav>
          <button
            className="mobile-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Image
              src="/menu.svg"
              alt="Menu"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <>
            {/* 회색 오버레이 */}
            <div
              className="fixed top-[70px] left-0 right-0 bottom-0 bg-black bg-opacity-30 z-40 md:hidden animate-fadeIn"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* 메뉴 패널 */}
            <div className="fixed top-[70px] right-0 w-[60%] h-[calc(100vh-70px)] bg-white z-50 md:hidden animate-slideInRight">
              <div className="p-6">
                <div className="flex flex-col space-y-6">
                  <Link
                    href="/about"
                    className={`font-medium font-['Pretendard'] tracking-tight hover:opacity-80 transition-opacity cursor-pointer ${
                      pathname === "/about" ? "text-red-500" : "text-cyan-900"
                    }`}
                    style={{ fontSize: "18pt" }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/projects"
                    className={`font-medium font-['Pretendard'] tracking-tight hover:opacity-80 transition-opacity cursor-pointer ${
                      pathname === "/projects"
                        ? "text-red-500"
                        : "text-cyan-900"
                    }`}
                    style={{ fontSize: "18pt" }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Projects
                  </Link>
                  <Link
                    href="/designers"
                    className={`font-medium font-['Pretendard'] tracking-tight hover:opacity-80 transition-opacity cursor-pointer ${
                      pathname === "/designers"
                        ? "text-red-500"
                        : "text-cyan-900"
                    }`}
                    style={{ fontSize: "18pt" }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Designers
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
