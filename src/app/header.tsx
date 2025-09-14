"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  
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
              <Link 
                href="/about" 
                className={`text-center justify-start text-lg font-black font-['NanumSquare_Neo_OTF'] tracking-tight hover:opacity-80 transition-opacity cursor-pointer ${
                  pathname === '/about' ? 'text-red-500' : 'text-cyan-900'
                }`}
              >
                About
              </Link>
              <Link 
                href="/projects" 
                className={`text-center justify-start text-lg font-black font-['NanumSquare_Neo_OTF'] tracking-tight hover:opacity-80 transition-opacity cursor-pointer ${
                  pathname === '/projects' ? 'text-red-500' : 'text-cyan-900'
                }`}
              >
                Projects
              </Link>
              <Link 
                href="/designers" 
                className={`text-center justify-start text-lg font-black font-['NanumSquare_Neo_OTF'] tracking-tight hover:opacity-80 transition-opacity cursor-pointer ${
                  pathname === '/designers' ? 'text-red-500' : 'text-cyan-900'
                }`}
              >
                Designers
              </Link>
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