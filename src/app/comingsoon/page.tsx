'use client';

import Footer from "../footer";



export default function ComingSoonPage() {
    return (
      <div className="flex flex-col min-h-screen">
        <iframe
          src="/comingsoon/index.html"
          style={{ flex: 1, width: "100%", border: "none" }}
          title="Coming Soon"
        />
      </div>
    );
  }