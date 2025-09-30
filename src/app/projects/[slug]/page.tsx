"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { useState, useEffect } from "react";
import type { Project } from "@/types/project";
import { projects } from "@/data/projects";

function getProject(id: string): Project | null {
  return projects.find((p) => p.id === id) || null;
}

function normalizeURL(url: string | null): string | null {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function getYouTubeId(url: string | null): string | null {
  if (!url) return null;
  const match = String(url).match(
    /(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/
  );
  return match ? match[1] : null;
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const project = getProject(slug);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!project) {
    notFound();
  }

  const youtubeId = getYouTubeId(project.youtube);
  const normalizedLink = normalizeURL(project.link);

  return (
    <div className="min-h-screen bg-white">
      {/* 뒤로가기 버튼 */}
      <div className="container-responsive pt-[73.6px] md:pt-[100px]">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/arrow.svg"
            alt="뒤로가기"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <div className="justify-start text-cyan-950 text-2xl font-black font-['NanumSquare_Neo_OTF'] mt-1">
            All Projects
          </div>
        </Link>
      </div>

      {/* 데스크탑 레이아웃 */}
      <div className="hidden md:block">
        <div className="container-responsive">
          {/* 타이틀과 서브타이틀 */}
          <div className="flex flex-col gap-5 mb-12 mt-[98.65px]">
            <div className="justify-start text-neutral-900 text-7xl font-bold font-['Pretendard']">
              {project.title}
            </div>
            <div className="justify-start text-neutral-900 text-3xl font-bold font-['Pretendard']">
              {project.subtitle}
            </div>
          </div>

          <div className="flex gap-10">
            {/* 왼쪽: 이미지들 - 1000px 최대, 비례 축소 */}
            <div className="flex-[1000] max-w-[1000px] mb-12">
              {/* 프로젝트 이미지들 - gap 없이 붙어서 */}
              <div className="space-y-0">
                {Array.from(
                  { length: project.assets.image_count },
                  (_, i) => i + 1
                ).map((num) => (
                  <div key={num} className="relative w-full">
                    <Image
                      src={`/projects/${project.assets.folder}/${num}.${project.assets.image_ext}`}
                      alt={`${project.title} - ${num}`}
                      width={1000}
                      height={750}
                      className="w-full h-auto"
                      sizes="(max-width: 768px) 100vw, 1000px"
                    />
                  </div>
                ))}

                {/* 유튜브 비디오 */}
                {youtubeId && (
                  <div className="relative w-full aspect-video bg-gray-100">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 오른쪽: 유저 정보 영역 - 490px 최대, 비례 축소 */}
            <div className="flex-[490] max-w-[490px]">
              <div className="sticky top-8">
                <div className="px-5 py-4 bg-white outline outline-1 outline-offset-[-0.50px] outline-black inline-flex flex-col justify-start items-start gap-[15px] w-full">
                  <div className="self-stretch flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch h-8 inline-flex justify-between items-center">
                      <div className="flex justify-center items-center gap-3.5">
                        <div className="justify-start text-neutral-900 text-2xl font-bold font-['Pretendard'] leading-loose">
                          {project.name}
                        </div>
                      </div>
                      <div className="w-5 h-5" />
                    </div>
                    <div className="justify-start text-neutral-600 text-lg font-medium font-['Pretendard'] leading-relaxed">
                      {project.email}
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-start gap-11 w-full">
                    <div className="w-full text-justify justify-start text-neutral-900 text-lg font-normal font-['Pretendard'] leading-relaxed">
                      {project.description}
                    </div>
                    {normalizedLink && (
                      <Link
                        href={normalizedLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-[5px] bg-black inline-flex justify-start items-center gap-[10px] hover:bg-gray-800 transition-colors"
                      >
                        <Image
                          src="/link.svg"
                          alt="링크"
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                        <div className="text-justify justify-start text-white text-lg font-bold font-['Pretendard'] leading-relaxed mt-1">
                          {project.linkname || "프로젝트 홈페이지"}
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 레이아웃 */}
      <div className="md:hidden px-[20px]">
        {/* 타이틀과 서브타이틀 */}
        <div className="flex flex-col gap-[14px] mb-8 mt-[57.5px]">
          <div className="justify-start text-neutral-900 text-6xl font-bold font-['Pretendard']">
            {project.title}
          </div>
          <div className="justify-start text-neutral-900 text-2xl font-bold font-['Pretendard']">
            {project.subtitle}
          </div>
        </div>

        {/* 유저 정보 카드 */}
        <div className="self-stretch flex justify-between items-end gap-[88px]">
          <div className="flex flex-col justify-start items-start gap-5 flex-1 min-w-0">
            <div className="flex flex-col justify-start items-start gap-2.5">
              <div className="flex justify-start items-center gap-3.5 flex-wrap">
                <div className="justify-start text-neutral-900 text-2xl font-bold font-['Pretendard'] leading-loose">
                  {project.name}
                </div>
                <div className="justify-start text-neutral-600 text-xl font-medium font-['Pretendard'] leading-loose">
                  {project.email}
                </div>
              </div>
            </div>
            <div className="text-justify justify-start text-neutral-900 text-xl font-normal font-['Pretendard'] leading-loose">
              {project.description}
            </div>
          </div>
          {normalizedLink && (
            <Link
              href={normalizedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-black flex justify-start items-center gap-2 hover:bg-gray-800 transition-colors flex-shrink-0 whitespace-nowrap"
            >
              <Image
                src="/link.svg"
                alt="링크"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="text-justify justify-start text-white text-lg font-bold font-['Pretendard'] leading-relaxed">
                {project.linkname || "링크 제목"}
              </div>
            </Link>
          )}
        </div>

        {/* 프로젝트 이미지들 - gap 없이 붙어서 */}
        <div className="space-y-0 -mx-6 my-8">
          {Array.from(
            { length: project.assets.image_count },
            (_, i) => i + 1
          ).map((num) => (
            <div key={num} className="relative w-full px-[20px]">
              <Image
                src={`/projects/${project.assets.folder}/${num}.${project.assets.image_ext}`}
                alt={`${project.title} - ${num}`}
                width={800}
                height={600}
                className="w-full h-auto"
                sizes="100vw"
              />
            </div>
          ))}

          {/* 유튜브 비디오 */}
          {youtubeId && (
            <div className="relative w-full aspect-video bg-gray-100">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* 플로팅 스크롤 탑 버튼 - 우측 하단 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-8 bottom-8 w-[77px] h-[77px] transition-all duration-300 z-50 hover:scale-105"
          aria-label="맨 위로 이동"
        >
          <svg
            width="77"
            height="77"
            viewBox="0 0 77 77"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_468_2414)">
              <circle cx="37.625" cy="35.707" r="30" fill="#02384B" />
              <path
                d="M26.5027 32.5783L37.6277 21.4534M37.6277 21.4534L48.7526 32.5783M37.6277 21.4534L37.6302 51.4534"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_468_2414"
                x="0.430273"
                y="0.910547"
                width="75.9883"
                height="75.9883"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx="0.799414" dy="3.19766" />
                <feGaussianBlur stdDeviation="3.99707" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_468_2414"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_468_2414"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </button>
      )}
    </div>
  );
}
