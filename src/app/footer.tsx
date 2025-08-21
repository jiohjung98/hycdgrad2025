"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-800">
      <div className="container-responsive">
        <div className="flex flex-row items-center justify-between py-16">
          <div className="flex flex-col gap-2">
            <p className="text-teal-50 text-sm font-semibold font-pretendard">
              2025 한양대학교 ERICA 커뮤니케이션디자인학과 졸업전시
            </p>
            <p className="text-teal-50/90 text-xs font-normal font-pretendard">
              © 2025 HYCD, All Right Reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Image
              src="/bottom_icon1.svg"
              alt="HYCD Icon"
              width={36}
              height={36}
              className="w-9 h-9"
            />
            <Image
              src="/bottom_icon2.svg"
              alt="Hanyang University Seal"
              width={36}
              height={36}
              className="w-9 h-9"
            />
            <Image
              src="/bottom_icon3.svg"
              alt="Hanyang University Logo"
              width={36}
              height={36}
              className="w-9 h-9"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
