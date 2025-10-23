"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ProjectTabKey } from "../types";

type Props = {
  isLightMode: boolean;
  active: ProjectTabKey;
  onChange: (k: ProjectTabKey) => void;
  className?: string;
};

const TABS: { key: ProjectTabKey; label: string }[] = [
  { key: "projects", label: "Projects" },
  { key: "certs",    label: "Certificates" },
  { key: "stack",    label: "Tech\u00A0Stack" },
];

export default function BottomTabs({ isLightMode, active, onChange, className = "" }: Props) {
  const baseBtn =
    "relative inline-flex items-center justify-center " +
    "px-1.5 sm:px-3 py-2.5 " +
    "bg-transparent border-0 outline-none focus:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "rounded-md select-none transition-none";

  const txt = (selected: boolean) =>
    `font-extrabold tracking-tight ${
      selected
        ? isLightMode ? "text-blue-700" : "text-blue-300"
        : isLightMode ? "text-black/70 hover:text-black" : "text-white/70 hover:text-white"
    }`;

  return (
    <div className={`w-full ${className}`}>
      <nav
        aria-label="Project sections"
        role="tablist"
        aria-orientation="horizontal"
        className="mx-auto flex max-w-4xl items-center justify-center gap-4 sm:gap-8 h-14 sm:h-16"
      >
        {TABS.map((t) => {
          const selected = t.key === active;

          const content = (
            // container label + underline → selalu center & akurat
            <span className="inline-flex flex-col items-center">
              {/* label: kecil di mobile */}
              <span className={`whitespace-nowrap text-base sm:text-2xl md:text-4xl ${txt(selected)}`}>
                {t.label}
              </span>

              <AnimatePresence initial={false}>
                {selected && (
                  <motion.span
                    layoutId="active-underline"      // anim pindah tab tetap mulus
                    className="rounded-md mt-1"       // underline di bawah teks (flow normal)
                    style={{
                      height: 8,                      // sedikit lebih tipis
                      width: "70%",                   // proporsional terhadap label
                      backgroundColor: isLightMode ? "#3B82F6" : "rgba(96,165,250,0.85)",
                    }}
                    transition={{ type: "spring", stiffness: 520, damping: 38, mass: 0.6 }}
                  />
                )}
              </AnimatePresence>
            </span>
          );

          // dua node supaya aria-selected berbentuk literal string (lolos lint axe)
          return selected ? (
            <button
              key={t.key}
              id={`tab-${t.key}`}
              role="tab"
              aria-selected="true"
              aria-controls={`panel-${t.key}`}
              tabIndex={0}
              type="button"
              className={baseBtn}
              onClick={() => onChange(t.key)}
            >
              {content}
            </button>
          ) : (
            <button
              key={t.key}
              id={`tab-${t.key}`}
              role="tab"
              aria-selected="false"
              aria-controls={`panel-${t.key}`}
              tabIndex={-1}
              type="button"
              className={baseBtn}
              onClick={() => onChange(t.key)}
            >
              {content}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
