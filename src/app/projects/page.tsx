'use client';

import React, { useState } from "react";
import Image from "next/image";

const categories = [
  "All",
  "Brand",
  "UX/UI",
  "Editorial",
  "Package",
];

const projects = Array.from({ length: 12 }).map((_, i) => ({
  title: "보글부글 웹",
  author: "Shim Joo Hyung",
}));

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [, setIsSearchFocused] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <div className="w-full h-[430px] relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/BackgroundTop.png')" }}>
        <div className="container-responsive relative z-10 h-full flex items-center justify-between">
          <div className="flex flex-col mb-8">
            <div className="justify-start text-cyan-900 text-7xl md:text-8xl font-normal -mb-4" style={{ fontFamily: 'var(--font-pinyon-script)' }}>Our</div>
            <div className="justify-start text-cyan-900 text-7xl md:text-8xl font-bold font-['Pretendard'] leading-[116.16px]">Projects</div>
          </div>
          <div className="relative mt-24 hidden md:block">
            <div className="absolute -top-[11rem] -right-[1rem] md:-right-8 z-10">
              <Image 
                src="/LogoBig.svg" 
                alt="Logo" 
                width={218} 
                height={270} 
                className="opacity-30"
                style={{ width: '218px', height: '270px' }}
              />
            </div>
            <div className="opacity-0 md:opacity-100 invisible md:visible relative z-20 text-right justify-start text-cyan-900 text-lg font-bold font-['Helvetica_Neue'] leading-snug transition-opacity duration-300">
              Designer Status Change Experiment Report <br/>- Based on the &apos;Boggle Buggle phenomenon&apos;
            </div>
          </div>
        </div>
        <div className="container-responsive absolute bottom-0 left-0 right-0">
          <div className="w-full">
            <div className="w-full bg-white border border-cyan-800 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 relative z-20 mr-2">
                <Image src="/Search.svg" alt="Search" width={20} height={20} />
                <input 
                  type="text" 
                  placeholder="Search Project" 
                  className="flex-1 text-cyan-900 text-lg font-medium font-['Pretendard'] outline-none bg-transparent placeholder:text-cyan-900 placeholder:opacity-60"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  style={{ caretColor: '#164e63' }}
                />
              </div>
              <div className="hidden md:flex gap-[36px]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="focus:outline-none transition-all duration-200"
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
      <div className="container-responsive md:hidden py-6">
        <div className="w-full">
          <div className="flex gap-[46px] justify-start flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="focus:outline-none transition-all duration-200"
              >
                {selectedCategory === cat ? (
                  <div className="text-center justify-start text-cyan-900 text-2xl font-extrabold font-['Pretendard'] underline">
                    {cat}
                  </div>
                ) : (
                  <div className="text-center justify-start text-cyan-900 text-2xl font-medium font-['Pretendard']">
                    {cat}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="container-responsive bg-white/60 backdrop-blur-sm projects-grid py-12">
        {projects.map((project, idx) => (
          <div key={idx} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex flex-col overflow-hidden border border-white/50 hover:shadow-xl transition-shadow duration-300">
            <div className="aspect-[16/9] bg-gradient-to-br from-cyan-100 to-sky-100 flex items-center justify-center text-lg text-cyan-700 font-medium">
              IMAGE<br />16:9
            </div>
            <div className="p-4 bg-white/80">
              <div className="font-bold text-sm mb-1 text-cyan-900">{project.title}</div>
              <div className="text-xs text-cyan-700">심주형 {project.author}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 