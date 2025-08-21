"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full bg-white">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-20">
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
              <div className="text-center justify-start text-lg font-black font-['NanumSquare_Neo_OTF'] tracking-tight nav-about">
                About
              </div>
              <div className="text-center justify-start text-lg font-black font-['NanumSquare_Neo_OTF'] tracking-tight nav-projects">
                Projects
              </div>
              <div className="text-center justify-start text-lg font-black font-['NanumSquare_Neo_OTF'] tracking-tight nav-designers">
                Designers
              </div>
            </div>
          </nav>
          <button className="mobile-menu">
            <Image
              src="/menu.svg"
              alt="Menu"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
    </header>
  );
} 