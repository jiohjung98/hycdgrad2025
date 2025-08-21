import React from "react";

const categories = [
  "All",
  "Brand",
  "UX/UI",
  "Editorial",
  "Package",
  "Interactive",
  "Illustration",
];

const projects = Array.from({ length: 12 }).map((_, i) => ({
  title: "보글부글 웹",
  author: "Shim Joo Hyung",
}));

export default function ProjectsPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-pink-200 py-8 px-2">
      {/* Centered content area */}
      <div className="container-responsive bg-blue-100 rounded-t-lg p-8 pb-0 flex flex-col items-stretch">
        <h1 className="text-4xl font-bold mb-4 bg-pink-200 w-fit px-2">Projects</h1>
        {/* Category Tabs */}
        <div className="flex gap-4 bg-green-100 px-2 py-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              className="text-sm font-medium px-2 py-1 rounded hover:bg-green-200 fo1cus:bg-green-300 focus:outline-none"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="container-responsive bg-pink-200 projects-grid py-8">
        {projects.map((project, idx) => (
          <div key={idx} className="bg-white rounded shadow flex flex-col overflow-hidden border border-pink-100">
            {/* Image Placeholder */}
            <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center text-2xl text-gray-400 font-bold">
              IMAGE<br />16:9
            </div>
            {/* Info */}
            <div className="p-2 bg-pink-50 border-t border-pink-100">
              <div className="font-bold text-sm mb-1">{project.title}</div>
              <div className="text-xs text-gray-600">심주형 {project.author}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 