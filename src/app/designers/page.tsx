"use client";

import React from "react";
import Image from "next/image";
import { projects } from "@/data/projects";
import Link from "next/link";

export default function DesignersPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <div
        className="w-full h-[300px] md:h-[430px] relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/BackgroundTop.png')" }}
      >
        <div className="container-responsive relative z-10 h-full flex items-center justify-between">
          <div className="flex flex-col mb-8">
            <div
              className="justify-start text-cyan-900 font-normal -mb-4"
              style={{
                fontFamily: "var(--font-pinyon-script)",
                fontSize: "clamp(48px, 10vw, 96px)",
              }}
            >
              Our
            </div>
            <div
              className="justify-start text-cyan-900 font-bold font-['Pretendard']"
              style={{
                fontSize: "clamp(48px, 10vw, 96px)",
                lineHeight: "1.2",
              }}
            >
              Designers
            </div>
          </div>
          <div className="relative mt-24 hidden md:block">
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
          {projects.map((project, idx) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="aspect-[3/4] shadow-lg overflow-hidden border border-white/50 hover:shadow-xl transition-all duration-300 group"
              style={{ borderRadius: "0px" }}
            >
              <div className="w-full h-full relative overflow-hidden">
                <Image
                  src={`/projects/${project.assets.folder}/${project.assets.photo}`}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* 웹: 호버시 하단 그라디언트 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-end p-4">
                  <div
                    className="flex items-center gap-[10px]"
                    style={{
                      position: "absolute",
                      bottom: "18px",
                      left: "12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      className="text-white/90 font-bold"
                      style={{
                        fontSize: "clamp(16px, 2.5vw, 31px)",
                        fontFamily: "Pretendard",
                      }}
                    >
                      {project.name}
                    </div>
                    <div
                      className="text-white/90"
                      style={{
                        fontSize: "clamp(14px, 2vw, 25px)",
                        fontFamily: "Pretendard",
                        fontWeight: "300",
                      }}
                    >
                      {project.en_name}
                    </div>
                  </div>
                </div>
                {/* 모바일: 평소 하단 그라디언트+이름 (이미지 안에) */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800/80 to-transparent flex items-end p-[18px] md:hidden">
                  <div
                    className="flex items-center gap-[10px]"
                    style={{
                      position: "absolute",
                      bottom: "18px",
                      left: "12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      className="text-white/90 font-bold"
                      style={{
                        fontSize: "clamp(12px, 4vw, 31px)",
                        fontFamily: "Pretendard",
                      }}
                    >
                      {project.name}
                    </div>
                    <div
                      className="text-white/90"
                      style={{
                        fontSize: "clamp(10px, 3.5vw, 25px)",
                        fontFamily: "Pretendard",
                        fontWeight: "300",
                      }}
                    >
                      {project.en_name}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
