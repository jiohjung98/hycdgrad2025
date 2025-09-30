"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function LandingPage() {
  const handleP5Load = () => {
    console.log("p5.js loaded via Script component");
  };

  const handleArt2Load = () => {
    console.log("art2.js loaded");

    setTimeout(() => {
      const bg = document.getElementById("bg");
      const canvas = bg?.querySelector("canvas");
      console.log("Canvas created:", !!canvas);

      if (!canvas) {
        console.log("Canvas not found - p5 may not have auto-started");
      }
    }, 500);
  };

  useEffect(() => {
    // CSS 로드
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "/style.css";
    document.head.appendChild(linkElement);

    return () => {
      linkElement.remove();
    };
  }, []);

  return (
    <>
      <div
        id="bg"
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          width: "100%",
          height: "100%",
        }}
      />

      <Script
        src="https://cdn.jsdelivr.net/npm/p5@1.9.3/lib/p5.min.js"
        strategy="beforeInteractive"
        onReady={handleP5Load}
      />

      <Script
        src="/art2.js"
        strategy="afterInteractive"
        onReady={handleArt2Load}
      />
    </>
  );
}
