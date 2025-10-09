"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const categories = ["All", "Brand", "UX/UI", "Editorial", "Package", "Character / Illustration"];

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
        <div className="flex items-center justify-between h-[60px] md:h-20">
          <div className="flex items-center">
            <Image
              src="/favicon.svg"
              alt="HYCD Logo"
              width={37}
              height={45}
              className="w-[28.75px] h-[35px] md:w-[37px] md:h-[45px]"
            />
          </div>
          <nav className="desktop-nav items-center">
            <div className="flex items-center gap-16">
              <Link
                href="/about"
                className={`text-center justify-start text-lg font-black font-['Pretendard'] tracking-tight hover:opacity-80 transition-opacity cursor-pointer ${
                  pathname === "/about" ? "text-red-500" : "text-cyan-900"
                }`}
                style={{ fontSize: "18px" }}
              >
                About
              </Link>
              <Link
                href="/projects"
                className={`text-center justify-start text-lg font-black font-['Pretendard'] tracking-tight hover:opacity-80 transition-opacity cursor-pointer ${
                  pathname === "/projects" || pathname.startsWith("/projects/")
                    ? "text-red-500"
                    : "text-cyan-900"
                }`}
                style={{ fontSize: "18px" }}
              >
                Projects
              </Link>
              <Link
                href="/designers"
                className={`text-center justify-start text-lg font-black font-['Pretendard'] tracking-tight hover:opacity-80 transition-opacity cursor-pointer ${
                  pathname === "/designers" ? "text-red-500" : "text-cyan-900"
                }`}
                style={{ fontSize: "18px" }}
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
              width={30}
              height={30}
              className="w-[30px] h-[30px]"
            />
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <>
            {/* 회색 오버레이 */}
            <div
              className="fixed top-[60px] left-0 right-0 bottom-0 bg-black bg-opacity-30 z-40 md:hidden animate-fadeIn"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* 메뉴 패널 */}
            <div className="fixed top-[60px] right-0 w-[60%] h-[calc(100vh-70px)] bg-white z-50 md:hidden animate-slideInRight">
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
                  <div>
                    <Link
                      href="/projects"
                      className={`font-medium font-['Pretendard'] tracking-tight hover:opacity-80 transition-opacity cursor-pointer ${
                        pathname === "/projects" ||
                        pathname.startsWith("/projects/")
                          ? "text-red-500"
                          : "text-cyan-900"
                      }`}
                      style={{ fontSize: "18pt" }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Projects
                    </Link>
                    {/* Projects 하위 카테고리들 */}
                    <div className="ml-4 mt-2 flex flex-col gap-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat}
                          href={`/projects${cat === "All" ? "" : `?category=${cat}`}`}
                          className={`font-normal font-['Pretendard'] tracking-tight hover:opacity-80 transition-opacity cursor-pointer ${
                            pathname.startsWith("/projects") ? "text-cyan-700" : "text-cyan-600"
                          }`}
                          style={{ fontSize: "14pt" }}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </div>
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
