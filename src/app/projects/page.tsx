"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { projects } from "@/data/projects";

const categories = [
  "All",
  "Brand",
  "UX/UI",
  "Editorial",
  "Package",
  "Character / Illustration",
];

// 영문 카테고리와 한글 카테고리 라벨 매핑
const categoryMapping: { [key: string]: string } = {
  Brand: "브랜드",
  "UX/UI": "UI/UX",
  Editorial: "편집",
  Package: "패키지",
  "Character / Illustration": "캐릭터 및 일러스트",
};

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [, setIsSearchFocused] = useState(false);

  // URL 쿼리 파라미터에서 카테고리 읽기
  useEffect(() => {
    const category = searchParams.get("category");
    if (category && categories.includes(category)) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // 필터링된 프로젝트 목록
  const filteredProjects = projects.filter((project) => {
    // 카테고리 필터링
    const categoryMatch =
      selectedCategory === "All" ||
      project.category_label === categoryMapping[selectedCategory];

    // 검색 필터링 (학번, 작품명, 이름, 영문이름)
    const searchMatch =
      searchQuery === "" ||
      project.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.en_name.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && searchMatch;
  });

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
            <div className="w-full bg-white border border-cyan-800 flex items-center justify-between h-[40px] md:h-[50px] px-[15px] md:px-5">
              <div className="flex items-center gap-2 md:gap-3 flex-1 relative z-20 mr-2">
                <Image
                  src="/Search.svg"
                  alt="Search"
                  width={16}
                  height={16}
                  className="w-4 h-4 md:w-5 md:h-5"
                />
                <input
                  type="text"
                  placeholder="Search Project"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-cyan-900 font-medium font-['Pretendard'] outline-none bg-transparent placeholder:text-cyan-900 mt-1"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  style={{
                    caretColor: "#164e63",
                    fontSize: "clamp(15px, 2.5vw, 20px)",
                  }}
                />
              </div>
              <div
                className="hidden md:flex relative z-30 whitespace-nowrap overflow-visible mt-1"
                style={{ gap: "clamp(4px, 1.5vw, 48px)" }}
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="focus:outline-none relative z-30 cursor-pointer flex-shrink-0 p-0 leading-none"
                  >
                    {selectedCategory === cat ? (
                      <div
                        className="text-center justify-start text-cyan-900 font-bold font-['Pretendard'] whitespace-nowrap border-b-2 border-cyan-900 leading-none"
                        style={{ fontSize: "clamp(14px, 2vw, 18px)" }}
                      >
                        {cat}
                      </div>
                    ) : (
                      <div
                        className="text-center justify-start text-cyan-900 font-medium font-['Pretendard'] whitespace-nowrap leading-none"
                        style={{ fontSize: "clamp(14px, 2vw, 18px)" }}
                      >
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
      <div className="container-responsive bg-white/60 backdrop-blur-sm projects-grid pb-5 md:py-[40px]">
        {filteredProjects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="bg-white/90 backdrop-blur-sm shadow-lg flex flex-col overflow-hidden border border-white/50 hover:shadow-xl transition-all duration-300 group"
          >
            {/* 썸네일 이미지 영역 */}
            <div className="relative">
              <div className="aspect-[4/3] relative bg-gradient-to-br from-cyan-100 to-sky-100">
                <Image
                  src={`/projects/${project.assets.folder}/${project.assets.thumb}`}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              {/* 웹: 호버시 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-800/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex flex-col justify-end p-[18px]">
                <div
                  className="text-white font-bold mb-[5px]"
                  style={{
                    fontSize: "clamp(16px, 2.5vw, 30px)",
                    fontFamily: "Pretendard",
                    lineHeight: "1",
                  }}
                >
                  {project.title}
                </div>
                <div className="flex items-center gap-[5px]">
                  <div
                    className="text-white/90 font-bold"
                    style={{
                      fontSize: "clamp(12px, 1.8vw, 18px)",
                      fontFamily: "Pretendard",
                      lineHeight: "1",
                    }}
                  >
                    {project.name}
                  </div>
                  <div
                    className="text-white/90"
                    style={{
                      fontSize: "clamp(10px, 1.4vw, 14px)",
                      fontFamily: "Pretendard",
                      fontWeight: "300",
                    }}
                  >
                    {project.en_name}
                  </div>
                </div>
              </div>
              {/* 모바일: 평소 그라디언트+제목+이름 (이미지 안에) */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-800/80 to-transparent flex flex-col justify-end p-[8px] md:hidden">
                <div
                  className="text-white font-bold mb-[5px]"
                  style={{
                    fontSize: "clamp(16px, 4vw, 36px)",
                    fontFamily: "Pretendard",
                    lineHeight: "1",
                  }}
                >
                  {project.title}
                </div>
                <div className="flex items-center gap-[5px]">
                  <div
                    className="text-white/90 font-bold"
                    style={{
                      fontSize: "clamp(12px, 3vw, 22px)",
                      fontFamily: "Pretendard",
                    }}
                  >
                    {project.name}
                  </div>
                  <div
                    className="text-white/90"
                    style={{
                      fontSize: "clamp(12px, 2.5vw, 17px)",
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
  );
}
