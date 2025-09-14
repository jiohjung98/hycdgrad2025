'use client';

import React from "react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      {/* Hero Banner */}
      <div className="w-full h-[430px] relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/BackgroundTop.png')" }}>
        {/* Content */}
        <div className="container-responsive relative z-10 h-full flex items-center justify-between">
          {/* Left side - Main text */}
          <div className="flex flex-col mb-8">
            <div className="justify-start text-cyan-900 text-6xl sm:text-7xl md:text-8xl font-normal -mb-4" style={{ fontFamily: 'var(--font-pinyon-script)' }}>About</div>
            <div className="justify-start text-cyan-900 text-6xl sm:text-7xl md:text-8xl font-bold font-['Pretendard'] leading-[116.16px]">Us</div>
          </div>
          
          {/* Right side - Logo */}
          <div className="relative mt-24">
            {/* Logo positioned above */}
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
          </div>
        </div>
      </div>
      
      {/* About Content */}
      <div className="container-responsive bg-white/60 backdrop-blur-sm py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-cyan-900 mb-8 text-center">HYCD Graduate Design 2025</h2>
          <div className="prose prose-lg text-cyan-900">
            <p className="text-lg leading-relaxed mb-6">
              Welcome to the HYCD Graduate Design 2025 showcase. This platform celebrates the innovative work 
              and creative vision of our graduating design students.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Our students have explored various design disciplines including branding, UX/UI, editorial design, 
              and packaging design, pushing the boundaries of creativity and innovation.
            </p>
            <p className="text-lg leading-relaxed">
              Explore their projects and discover the future of design through their unique perspectives and 
              groundbreaking solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
