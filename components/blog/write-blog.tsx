"use client";

import { useRouter } from "next/navigation";
import { PenTool } from "lucide-react";

export default function WriteBlogButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/submit-blog")}
      className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
    >
      <PenTool className="w-4 h-4" />
      <span>Write Article</span>
    </button>
  );
}
