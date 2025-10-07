'use client';

import Footer from "../footer";



export default function ComingSoonPage() {
    return (
      <div className="w-full h-screen overflow-hidden">
        <iframe
          src="/comingsoon/index.html"
          style={{ 
            width: "100%", 
            height: "100dvh", 
            border: "none",
            display: "block"
          }}
          title="Coming Soon"
        />
      </div>
    );
  }