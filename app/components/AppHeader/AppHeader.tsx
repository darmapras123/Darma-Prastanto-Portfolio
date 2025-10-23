// app/components/AppHeader/AppHeader.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  activeSection: string;
  setActiveSection: (id: string) => void;
  isLightMode: boolean;
  triggerTransition: (toLight: boolean) => void;
  /** bila true, tampilkan versi inline (tanpa wrapper fixed) */
  renderInline?: boolean;
  /** tinggi header untuk mobile & desktop (dipakai juga utk kompensasi scroll) */
  headerHeightMobile?: number;   // default 32
  headerHeightDesktop?: number;  // default 44
};

const NAV = [
  { id: "lanyard-section", label: "Home" },
  { id: "about", label: "About" },
  { id: "project", label: "Project" },
  { id: "contact", label: "Contact" },
];

export default function AppHeader({
  activeSection,
  setActiveSection,
  isLightMode,
  triggerTransition,
  renderInline = false,
  headerHeightMobile = 32,
  headerHeightDesktop = 44,
}: Props) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  // ====== tinggi header aktual (untuk kompensasi scroll) ======
  const navRef = useRef<HTMLDivElement | null>(null);
  const headerHeightRef = useRef<number>(headerHeightDesktop);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const update = () => {
      const h = el.getBoundingClientRect().height;
      headerHeightRef.current =
        h ||
        (window.matchMedia("(max-width: 640px)").matches
          ? headerHeightMobile
          : headerHeightDesktop);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [headerHeightMobile, headerHeightDesktop]);

  // ====== Utilities: cari kontainer scroll yang benar ======
  const isScrollable = (el: Element) => {
    const style = window.getComputedStyle(el);
    const oy = style.overflowY;
    const o = style.overflow;
    const scrollableY = oy === "auto" || oy === "scroll";
    const scrollable = scrollableY || o === "auto" || o === "scroll";
    const canScroll =
      (el as HTMLElement).scrollHeight > (el as HTMLElement).clientHeight;
    return scrollable && canScroll;
  };

  const findScrollContainer = (targetEl: Element): Element | "window" => {
    let node: Element | null = targetEl.parentElement;
    while (node && node !== document.body) {
      if (isScrollable(node)) return node;
      node = node.parentElement;
    }
    return "window";
  };

  const getSectionElements = () => {
    return NAV.map(s => ({ id: s.id, el: document.getElementById(s.id) }))
              .filter((s): s is {id: string; el: HTMLElement} => !!s.el);
  };

  // ====== Helper: scroll dengan extra offset + dukung custom scroll container ======
  const scrollToSectionWithOffset = (id: string, extra: number) => {
    const target = document.getElementById(id);

    // ——— FIX HOME DI MOBILE (anchor kadang disembunyikan) ———
    if (!target && id === "lanyard-section") {
      const anySection = getSectionElements()[0];
      const container = anySection ? findScrollContainer(anySection.el) : "window";
      if (container === "window") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        (container as HTMLElement).scrollTo({ top: 0, behavior: "smooth" });
      }
      setActiveSection(id);
      return;
    }

    if (!target) return;

    const headerOffset = headerHeightRef.current + 16 + (extra || 0); // buffer 16px + extra
    const container = findScrollContainer(target);

    if (container === "window") {
      const rect = target.getBoundingClientRect();
      const absoluteY = window.scrollY + rect.top;
      window.scrollTo({
        top: Math.max(0, absoluteY - headerOffset),
        behavior: "smooth",
      });
    } else {
      const cRect = (container as HTMLElement).getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      const current = (container as HTMLElement).scrollTop;
      const delta = tRect.top - cRect.top; // jarak target dari atas kontainer
      const to = Math.max(0, current + delta - headerOffset);

      (container as HTMLElement).scrollTo({
        top: to,
        behavior: "smooth",
      });
    }

    setActiveSection(id);
  };

  // ====== Scroll Spy deterministik (perbaiki Project↔Contact & Top↔About) ======
  useEffect(() => {
    const sections = getSectionElements();
    if (sections.length === 0) return;

    const container = findScrollContainer(sections[0].el);

    let rafId = 0;
    const topOffset = () => headerHeightRef.current + 12; // garis referensi di bawah header

    // >>> Perbaikan utama: ambang "atas" dinamis (bukan 1px)
    const topThreshold = () => Math.max(8, Math.floor(topOffset() * 0.9));

    const currentScroll = () =>
      container === "window"
        ? (document.scrollingElement?.scrollTop || window.scrollY)
        : (container as HTMLElement).scrollTop;

    const isAtTop = () => currentScroll() <= topThreshold();

    const isAtBottom = () => {
      if (container === "window") {
        const doc = document.scrollingElement;
        if (!doc) return false;
        return doc.scrollTop + window.innerHeight >= doc.scrollHeight - 1;
      }
      const c = container as HTMLElement;
      return c.scrollTop + c.clientHeight >= c.scrollHeight - 1;
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // 1) paling atas → Home (pakai ambang dinamis)
        if (isAtTop()) {
          if (activeSection !== "lanyard-section") {
            setActiveSection("lanyard-section");
          }
          return;
        }

        // 2) paling bawah → Contact
        if (isAtBottom()) {
          if (activeSection !== "contact") {
            setActiveSection("contact");
          }
          return;
        }

        // 3) pilih section teratas yang sudah melewati garis offset header
        const cRect = container === "window"
          ? { top: 0 } as DOMRect
          : (container as HTMLElement).getBoundingClientRect();

        const line = topOffset();
        let bestId: string | null = null;
        let bestTop = -Infinity;

        for (const s of sections) {
          const tRect = s.el.getBoundingClientRect();
          const relTop = tRect.top - cRect.top;
          if (relTop <= line + 1 && relTop > bestTop) {
            bestTop = relTop;
            bestId = s.id;
          }
        }

        if (!bestId) {
          let minDist = Infinity;
          for (const s of sections) {
            const tRect = s.el.getBoundingClientRect();
            const relTop = tRect.top - cRect.top;
            const dist = Math.abs(relTop - line);
            if (dist < minDist) {
              minDist = dist;
              bestId = s.id;
            }
          }
        }

        if (bestId && bestId !== activeSection) {
          setActiveSection(bestId);
        }
      });
    };

    const add = () => {
      if (container === "window") {
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
      } else {
        (container as HTMLElement).addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
      }
    };
    const remove = () => {
      if (container === "window") {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      } else {
        (container as HTMLElement).removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
      if (rafId) cancelAnimationFrame(rafId);
    };

    add();
    onScroll(); // trigger awal

    return remove;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setActiveSection, headerHeightMobile, headerHeightDesktop]);

  // ====== Styles ======
  const headerBg = isLightMode ? "bg-black/40" : "bg-white";
  const headerBorder = isLightMode ? "border-white/15" : "border-black/10";
  const headerShadow = isLightMode
    ? "shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
    : "shadow-[0_8px_30px_rgba(0,0,0,0.15)]";

  const pillActiveBg = isLightMode ? "bg-white" : "bg-black";
  const pillActiveText = isLightMode ? "text-black" : "text-white";
  const pillIdle = isLightMode
    ? "text-white/80 hover:text-white"
    : "text-black/70 hover:text-black";

  const modeTextColor = "text-blue-600 hover:text-blue-700";

  // ====== Nav Core ======
  const NavCore = (
    <nav
      ref={navRef}
      aria-label="Primary"
      className={[
        "flex items-center",
        "w-fit",
        headerBg,
        headerBorder,
        "backdrop-blur-md",
        headerShadow,
        "border",
        "rounded-full",
        "px-2 sm:px-3",
        `[--header-h:${headerHeightMobile}px]`,
        `sm:[--header-h:${headerHeightDesktop}px]`,
        "h-[var(--header-h)]",
      ].join(" ")}
    >
      {/* Track nav */}
      <div className="relative flex items-center gap-[2px] sm:gap-1">
        <AnimatePresence initial={false}>
          {NAV.map((item) => {
            const isActive = activeSection === item.id;
            const extraOffset = item.id === "project" ? 32 : 0; // offset khusus Project

            return (
              <motion.button
                type="button"
                key={item.id}
                onMouseEnter={() => setHoverId(item.id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => scrollToSectionWithOffset(item.id, extraOffset)}
                className={[
                  "relative",
                  "rounded-full",
                  "h-[calc(var(--header-h)-10px)]",
                  "px-2 text-[10px]",
                  "sm:px-3 sm:text-[13px]",
                  "flex items-center",
                  "transition-colors",
                  "font-semibold tracking-tight",
                  isActive ? pillActiveText : pillIdle,
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
              >
                {isActive && (
                  <motion.span
                    layoutId="pill-active"
                    className={["absolute inset-[2px] rounded-full", pillActiveBg].join(" ")}
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div
        className={[
          "mx-2 sm:mx-3 w-px self-stretch",
          isLightMode ? "bg-white/25" : "bg-black/15",
        ].join(" ")}
      />

      {/* Toggle Mode */}
      <motion.button
        type="button"
        onClick={() => triggerTransition(!isLightMode)}
        className={[
          "rounded-full",
          "h-[calc(var(--header-h)-10px)]",
          "px-2 text-[10px]",
          "sm:px-3 sm:text-[13px]",
          "flex items-center justify-center",
          "transition-colors",
          modeTextColor,
        ].join(" ")}
        whileHover={{ scale: 1.04, y: -1 }}
        whileTap={{ scale: 0.97 }}
        aria-label={isLightMode ? "light mode" : "dark mode"}
      >
        {/* Mobile: dua baris */}
        <span className="sm:hidden leading-[1.05] text-center">
          {isLightMode ? (
            <>
              <span className="block">Light</span>
              <span className="block">Mode</span>
            </>
          ) : (
            <>
              <span className="block">Dark</span>
              <span className="block">Mode</span>
            </>
          )}
        </span>
        {/* Desktop: satu baris */}
        <span className="hidden sm:inline">
          {isLightMode ? "Light Mode" : "Dark Mode"}
        </span>
      </motion.button>
    </nav>
  );

  // ====== render: inline vs fixed ======
  if (renderInline) {
    return NavCore;
  }

  // fallback: versi standalone masih fixed (jika dipakai terpisah)
  return (
    <div className="pointer-events-none fixed inset-x-0 top-2 sm:top-4 z-[1000] flex justify-center">
      <div className="pointer-events-auto">{NavCore}</div>
    </div>
  );
}
