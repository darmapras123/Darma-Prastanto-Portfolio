"use client";

import type { ProjectTabKey } from "../types";

export default function Columns({
  isLightMode,
  active,
  onChange,
}: {
  isLightMode: boolean;
  active: ProjectTabKey;
  onChange: (k: ProjectTabKey) => void;
}) {
  const btnBase =
    "group relative rounded-2xl border px-5 py-6 sm:py-8 flex items-center justify-center gap-3 cursor-pointer transition-colors select-none";
  const btnLight = "bg-white/60 border-black/10 hover:bg-white";
  const btnDark = "bg-slate-800/50 border-white/10 hover:bg-slate-800/70";
  const numberStyle = "text-5xl sm:text-6xl leading-none tracking-tight font-semibold";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {/* 1 — Certificates */}
      <button
        onClick={() => onChange("certs")}
        className={[
          btnBase,
          isLightMode ? btnLight : btnDark,
          "colCertificates",
          active === "certs" ? "ring-2 ring-yellow-400/70" : "",
        ].join(" ")}
        aria-label="Open Certificates"
      >
        <span className={[numberStyle, active === "certs" ? "opacity-100" : "opacity-70"].join(" ")}>1</span>
        <span className="text-base sm:text-lg font-medium">Certificates</span>
      </button>

      {/* 2 — Tech Stack */}
      <button
        onClick={() => onChange("stack")}
        className={[
          btnBase,
          isLightMode ? btnLight : btnDark,
          "colStack",
          active === "stack" ? "ring-2 ring-yellow-400/70" : "",
        ].join(" ")}
        aria-label="Open Tech Stack"
      >
        <span className={[numberStyle, active === "stack" ? "opacity-100" : "opacity-70"].join(" ")}>2</span>
        <span className="text-base sm:text-lg font-medium">Tech Stack</span>
      </button>
    </div>
  );
}
