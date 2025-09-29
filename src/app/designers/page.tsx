"use client";

import React from "react";
import Image from "next/image";

const designers = [
  {
    name: "심주형",
    nameEn: "Shim Joo Hyung",
    role: "UX/UI Designer",
    image: "/example.png",
    description:
      "Specialized in user experience and interface design with a focus on accessibility and user-centered design principles.",
  },
  {
    name: "김민수",
    nameEn: "Kim Min Soo",
    role: "Brand Designer",
    image: "/example.png",
    description:
      "Creative brand strategist with expertise in visual identity, logo design, and brand storytelling.",
  },
  {
    name: "이지은",
    nameEn: "Lee Ji Eun",
    role: "Editorial Designer",
    image: "/example.png",
    description:
      "Passionate about typography, layout design, and creating compelling visual narratives through print and digital media.",
  },
  {
    name: "박준호",
    nameEn: "Park Joon Ho",
    role: "Package Designer",
    image: "/example.png",
    description:
      "Innovative packaging specialist who combines functionality with aesthetic appeal to create memorable product experiences.",
  },
  {
    name: "최수진",
    nameEn: "Choi Soo Jin",
    role: "Product Designer",
    image: "/example.png",
    description:
      "Innovative product designer focused on creating user-centered solutions that bridge aesthetics and functionality.",
  },
  {
    name: "정현우",
    nameEn: "Jung Hyun Woo",
    role: "Interaction Designer",
    image: "/example.png",
    description:
      "Expert in creating engaging digital experiences through thoughtful interaction design and user research.",
  },
  {
    name: "한소영",
    nameEn: "Han So Young",
    role: "Visual Designer",
    image: "/example.png",
    description:
      "Creative visual designer with a passion for creating compelling visual narratives and brand experiences.",
  },
  {
    name: "윤태호",
    nameEn: "Yoon Tae Ho",
    role: "Service Designer",
    image: "/example.png",
    description:
      "Service design specialist focused on improving user experiences through systematic design thinking and research.",
  },
  {
    name: "임서연",
    nameEn: "Lim Seo Yeon",
    role: "Motion Designer",
    image: "/example.png",
    description:
      "Dynamic motion designer creating engaging animations and visual effects that bring designs to life.",
  },
  {
    name: "강동현",
    nameEn: "Kang Dong Hyun",
    role: "Digital Designer",
    image: "/example.png",
    description:
      "Digital design expert specializing in creating innovative online experiences and digital product interfaces.",
  },
];

export default function DesignersPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      {/* Hero Banner */}
      <div
        className="w-full h-[300px] md:h-[430px] relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/BackgroundTop.png')" }}
      >
        {/* Content */}
        <div className="container-responsive relative z-10 h-full flex items-center justify-between">
          {/* Left side - Main text */}
          <div className="flex flex-col mb-8">
            <div
              className="justify-start text-cyan-900 text-6xl sm:text-7xl md:text-8xl font-normal -mb-4"
              style={{ fontFamily: "var(--font-pinyon-script)" }}
            >
              Our
            </div>
            <div className="justify-start text-cyan-900 text-6xl sm:text-7xl md:text-8xl font-bold font-['Pretendard'] leading-[116.16px]">
              Designers
            </div>
          </div>

          {/* Right side - Subtitle with Logo */}
          <div className="relative mt-24">
            {/* Logo positioned above text */}
            <div className="absolute -top-[11rem] -right-[1rem] md:-right-8 z-10">
              <Image
                src="/LogoBig.svg"
                alt="Logo"
                width={218}
                height={270}
                className="opacity-30"
                style={{ width: "218px", height: "270px" }}
              />
            </div>
            <div className="opacity-0 md:opacity-100 invisible md:visible relative z-20 text-right justify-start text-cyan-900 text-lg font-bold font-['Helvetica_Neue'] leading-snug transition-opacity duration-300">
              39th Graduate Students of the Department of <br />
              Communication Design at Hanyang University ERICA.
            </div>
          </div>
        </div>
      </div>
      <div className="container-responsive bg-white/60 backdrop-blur-sm pb-5 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {designers.map((designer, idx) => (
            <div
              key={idx}
              className="aspect-[3/4] shadow-lg overflow-hidden border border-white/50 hover:shadow-xl transition-all duration-300 group"
              style={{ borderRadius: "0px" }}
            >
              <div className="w-full h-full relative overflow-hidden">
                <Image
                  src={designer.image}
                  alt={designer.name}
                  width={200}
                  height={267}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* 하단부 그라디언트 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="w-full p-4 text-white">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <div
                        className="font-bold"
                        style={{
                          fontSize: "clamp(14px, 4vw, 22px)",
                          fontFamily: "Pretendard",
                        }}
                      >
                        {designer.name}
                      </div>
                      <div
                        className="opacity-90"
                        style={{
                          fontSize: "clamp(12px, 3.5vw, 18px)",
                          fontFamily: "Pretendard",
                          fontWeight: "300",
                        }}
                      >
                        {designer.nameEn}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
