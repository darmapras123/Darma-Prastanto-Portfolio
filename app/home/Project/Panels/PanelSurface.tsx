// app/home/Project/Panels/PanelSurface.tsx
"use client";

import React from "react";

export default function PanelSurface({
  isLightMode,
  children,
  className = "",
}: {
  isLightMode: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[820px] mt-5 px-0 ${className}`}>
      <div
        // ⬇️ Background statis (tanpa animasi)
        className={[
          "rounded-3xl border p-0",
          isLightMode
            ? "bg-white/80 border-zinc-200"
            : "bg-zinc-900/70 border-white/10",
        ].join(" ")}
      >
        {/* Konten panel akan diletakkan di dalam wrapper ini */}
        {children}
      </div>
    </div>
  );
}
