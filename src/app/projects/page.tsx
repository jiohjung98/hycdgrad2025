"use client";

import React, { useState } from "react";
import Image from "next/image";

const categories = ["All", "Brand", "UX/UI", "Editorial", "Package"];

const projects = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: "보글부글 웹",
  author: "Shim Joo Hyung",
  category: ["Brand", "UX/UI", "Editorial", "Package"][i % 4],
}));

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [, setIsSearchFocused] = useState(false);

  // 필터링된 프로젝트 목록
  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <div
        className="w-full h-[300px] md:h-[430px] relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/BackgroundTop.png')" }}
      >
        <div className="container-responsive relative z-10 h-full flex items-center justify-between">
          <div className="flex flex-col mb-8">
            <div
              className="justify-start text-cyan-900 text-6xl sm:text-7xl md:text-8xl font-normal -mb-4"
              style={{ fontFamily: "var(--font-pinyon-script)" }}
            >
              Our
            </div>
            <div className="justify-start text-cyan-900 text-6xl sm:text-7xl md:text-8xl font-bold font-['Pretendard'] leading-[116.16px]">
              Projects
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
              Designer Status Change Experiment Report <br />- Based on the
              &apos;Boggle Buggle phenomenon&apos;
            </div>
          </div>
        </div>
        <div
          className="container-responsive absolute bottom-0 left-0 right-0"
          style={{ marginBottom: "25px" }}
        >
          <div className="w-full">
            <div
              className="w-full bg-white border border-cyan-800 flex items-center justify-between"
              style={{ height: "50px", padding: "20px" }}
            >
              <div className="flex items-center gap-3 flex-1 relative z-20 mr-2">
                <Image src="/Search.svg" alt="Search" width={20} height={20} />
                <input
                  type="text"
                  placeholder="Search Project"
                  className="flex-1 text-cyan-900 font-medium font-['Pretendard'] outline-none bg-transparent placeholder:text-cyan-900 placeholder:opacity-60"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  style={{
                    caretColor: "#164e63",
                    fontSize: "18px",
                  }}
                />
              </div>
              <div className="hidden md:flex gap-[36px] relative z-30">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="focus:outline-none transition-all duration-200 relative z-30 cursor-pointer"
                  >
                    {selectedCategory === cat ? (
                      <div className="text-center justify-start text-cyan-900 text-lg font-extrabold font-['Pretendard'] underline">
                        {cat}
                      </div>
                    ) : (
                      <div className="text-center justify-start text-cyan-900 text-lg font-medium font-['Pretendard']">
                        {cat}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-responsive md:hidden py-[20px]">
        <div className="w-full">
          <div
            className="flex gap-5 justify-start flex-wrap"
            style={{ gap: "20px" }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="focus:outline-none transition-all duration-200 cursor-pointer"
              >
                {selectedCategory === cat ? (
                  <div
                    className="text-center justify-start text-cyan-900 font-extrabold font-['Pretendard'] underline"
                    style={{ fontSize: "18pt" }}
                  >
                    {cat}
                  </div>
                ) : (
                  <div
                    className="text-center justify-start text-cyan-900 font-medium font-['Pretendard']"
                    style={{ fontSize: "18pt" }}
                  >
                    {cat}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="container-responsive bg-white/60 backdrop-blur-sm projects-grid pb-5 md:py-12">
        {filteredProjects.map((project, idx) => (
          <div
            key={project.id}
            className="bg-white/90 backdrop-blur-sm shadow-lg flex flex-col overflow-hidden border border-white/50 hover:shadow-xl transition-all duration-300 group"
          >
            {/* 썸네일 이미지 영역 */}
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-cyan-100 to-sky-100 flex items-center justify-center text-lg text-cyan-700 font-medium">
                IMAGE
                <br />
                4:3
              </div>
              {/* 웹: 호버시 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-800/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex flex-col justify-end p-4">
                <div
                  className="text-white font-bold mb-1"
                  style={{
                    fontSize: "clamp(16px, 2.5vw, 36px)",
                    fontFamily: "Pretendard",
                    marginTop: "5px",
                  }}
                >
                  {project.title}
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="text-white/90 font-bold"
                    style={{
                      fontSize: "clamp(12px, 1.8vw, 22px)",
                      fontFamily: "Pretendard",
                    }}
                  >
                    심주형
                  </div>
                  <div
                    className="text-white/90"
                    style={{
                      fontSize: "clamp(10px, 1.4vw, 18px)",
                      fontFamily: "Pretendard",
                      fontWeight: "300",
                    }}
                  >
                    {project.author}
                  </div>
                </div>
              </div>
              {/* 모바일: 평소 그라디언트+제목+이름 (이미지 안에) */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-800/80 to-transparent flex flex-col justify-end p-2 md:hidden">
                <div
                  className="text-white font-bold mb-1"
                  style={{
                    fontSize: "clamp(16px, 4vw, 36px)",
                    fontFamily: "Pretendard",
                    marginTop: "5px",
                  }}
                >
                  {project.title}
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="text-white/90 font-bold"
                    style={{
                      fontSize: "clamp(12px, 3vw, 22px)",
                      fontFamily: "Pretendard",
                    }}
                  >
                    심주형
                  </div>
                  <div
                    className="text-white/90"
                    style={{
                      fontSize: "clamp(10px, 2.5vw, 17px)",
                      fontFamily: "Pretendard",
                      fontWeight: "300",
                    }}
                  >
                    {project.author}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
