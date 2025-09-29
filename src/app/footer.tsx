"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-800">
      <div className="container-responsive">
        <div className="flex flex-row items-center justify-between py-16">
          <div className="flex flex-col gap-2">
            {/* 데스크톱: 한 줄로 표시 */}
            <p className="text-teal-50 text-sm font-semibold font-pretendard hidden md:block">
              2025 한양대학교 ERICA 커뮤니케이션디자인학과 졸업전시
            </p>
            {/* 모바일: ERICA / 커뮤니케이션디자인학과로 분리 */}
            <div className="text-teal-50 text-sm font-semibold font-pretendard md:hidden">
              <p>2025 한양대학교 ERICA</p>
              <p>커뮤니케이션디자인학과 졸업전시</p>
            </div>
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
            {/* 한양대학교 로고와 로고타입을 하나로 취급하여 동일한 크기로 */}
            <div className="flex items-center gap-2">
              <Image
                src="/bottom_icon2.svg"
                alt="Hanyang University Seal"
                width={36}
                height={36}
                className="w-9 h-9"
              />
              <div className="text-teal-50 text-sm font-semibold font-pretendard">
                <div>한양대학교</div>
                <div className="text-xs">HANYANG UNIVERSITY</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
