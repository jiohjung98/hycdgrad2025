"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-800">
      <div className="container-responsive">
        <div className="flex flex-row min-[450px]:flex-row flex-col items-start min-[450px]:items-center justify-between py-16 gap-6 min-[450px]:gap-0">
          <div className="flex flex-col gap-2">
            <p className="text-teal-50 text-sm font-semibold font-pretendard hidden min-[600px]:block">
              2025 한양대학교 ERICA 커뮤니케이션디자인학과 졸업전시
            </p>
            <div className="text-teal-50 text-sm font-semibold font-pretendard min-[600px]:hidden">
              <p>2025 한양대학교 ERICA</p>
              <p>커뮤니케이션디자인학과 졸업전시</p>
            </div>
            <p className="text-teal-50/90 text-xs font-normal font-pretendard">
              © 2025 HYCD, All Right Reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src="/bottom_icon1.svg"
              alt="HYCD Icon"
              width={36}
              height={36}
              className="w-9 h-9"
              style={{ width: "auto", height: "auto" }}
            />
            <Image
              src="/bottom_icon2.svg"
              alt="Hanyang University Seal"
              width={154}
              height={36}
              className="w-full h-9"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
