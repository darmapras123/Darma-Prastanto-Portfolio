"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import TypingTitle from "../components/AppHeader/Hero/TypingTitle";

import AboutSection from "./About/AboutSection";
import ProjectSection from "./Project/ProjectSection";
import ContactSection from "./Contact/ContactSection";
import CVBox from "../components/CVBox/CVBox";

// ⬇️ Tambahan: import ProjectBox & HubungiSaya
import ProjectBox from "../components/LihatProject/LihatProject";
import HubungiSaya from "../components/HubungiSaya/HubungiSaya";

// ⬇️ Header utama (masih dipakai di blok "hidden" lama)
import AppHeader from "../components/AppHeader/AppHeader";
// ⬇️ Header compact yang memuat SVG logo + AppHeader (dipisah)
import CompactHeaderRow from "../components/AppHeader/CompactHeaderRow";

/* ================== Dynamic import untuk Lanyard (no SSR) ================== */
const LanyardDynamic = dynamic(() => import("../components/Lanyard/Lanyard"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[260px] grid place-items-center rounded-xl border border-black/10 dark:border-white/10">
      <p className="text-sm text-black/70 dark:text-white/70">Loading 3D…</p>
    </div>
  ),
});

/* ================== Dynamic import untuk Stars (no SSR) ================== */
const StarsNoSSR = dynamic(
  () => import("../components/Background/StarsCanvas"),
  { ssr: false }
);

/* ================= Overlay Transisi Lingkaran ================= */
function ModeTransitionOverlay({
  isAnimating,
  color,
  fromTop,
  onAnimationEnd,
}: {
  isAnimating: boolean;
  color: string;
  fromTop: boolean;
  onAnimationEnd: () => void;
}) {
  const bgClass = color === "white" ? "bg-white" : "bg-black";
  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          className={`fixed left-1/2 z-[9999] rounded-full ${fromTop ? "top-0" : "bottom-0"} ${bgClass} w-[100px] h-[100px] -translate-x-1/2`}
          initial={{ scale: 0, y: fromTop ? "-100%" : "100%" }}
          animate={{ scale: 50, y: "0%" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          onAnimationComplete={onAnimationEnd}
        />
      )}
    </AnimatePresence>
  );
}

function Aurora() {
  return null;
}

/* ================= Typewriter ================= */
function TypewriterText({ start, isLightMode }: { start: boolean; isLightMode: boolean }) {
  // ✅ PERBAIKAN: Mengganti list kata sesuai dengan keinginan Anda dan menghapus Animation
  const words = ["AI-Assisted Developer", "UI/UX Designer", "Graphic Designer"];
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!start) return;

    const currentWord = words[wordIndex];
    let typingSpeed = isDeleting
      ? Math.floor(Math.random() * (100 - 40) + 40)
      : Math.floor(Math.random() * (180 - 80) + 80);

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentWord.length) {
        setText(currentWord.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setText(currentWord.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, start]);

  return (
    <div className="flex flex-col items-start typewriter-wrap">
      <h3
        className={`mt-6 text-4xl font-mono ${
          isLightMode ? "text-yellow-400" : "text-yellow-400"
        } typewriter-line`}
      >
        {text}
        <span className="animate-pulse caret">|</span>
      </h3>
    </div>
  );
}

/* ================= HomePage ================= */
export default function HomePage() {
  const [posX, setPosX] = useState(0);
  const [zPos, setZPos] = useState(22);
  const [activeSection, setActiveSection] = useState("lanyard-section");
  const [isLightMode, setIsLightMode] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);
  const [overlayColor, setOverlayColor] = useState("white");
  const [fromTop, setFromTop] = useState(false);
  const [pendingMode, setPendingMode] = useState<null | boolean>(null);

  const [startTypewriter, setStartTypewriter] = useState(false);

  // WebGL guard
  const webglOK = useMemo(() => {
    if (typeof window === "undefined") return false;
    try {
      const c = document.createElement("canvas");
      const ok =
        !!(window as any).WebGLRenderingContext &&
        (c.getContext("webgl") || c.getContext("experimental-webgl"));
      return !!ok;
    } catch {
      return false;
    }
  }, []);

  // DETEKSI MOBILE RUNTIME
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () =>
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Efek BLUR saat masuk halaman
  const [introBlur, setIntroBlur] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIntroBlur(false), 500);
    return () => clearTimeout(t);
  }, []);

  // Intro tween halus
  useEffect(() => {
    const targetX = 0;
    const targetZ = 12;

    setPosX(-2);
    setZPos(22);

    let raf = 0;
    let start: number | null = null;
    const duration = 1200;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const e = easeOutCubic(p);

      setPosX(-2 + (targetX + 2) * e);
      setZPos(22 + (targetZ - 22) * e);

      if (p < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Redirect jika reload
  useEffect(() => {
    const navEntries = performance.getEntriesByType("navigation");
    the_isReload: {
      const isReload =
        navEntries.length > 0 &&
        (navEntries[0] as PerformanceNavigationTiming).type === "reload";
      if (isReload) {
        window.location.replace("/");
      }
    }
  }, []);

// Active section observer
  useEffect(() => {
    const sections = document.querySelectorAll(
      "#lanyard-section, #about, #project, #contact"
    );
    const observer = new IntersectionObserver(
      (entries) => { // benerin bagian ini jadi huruf kecil 'entries'
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const triggerTransition = (toLight: boolean) => {
    if (!isLightMode && toLight) {
      setOverlayColor("white");
      setFromTop(true);
    } else if (isLightMode && !toLight) {
      setOverlayColor("black");
      setFromTop(false);
    }
    setPendingMode(toLight);
    setIsAnimating(true);
  };

  const handleAnimationEnd = () => {
    if (pendingMode !== null) {
      setIsLightMode(pendingMode);
      setPendingMode(null);
    }
    setIsAnimating(false);
  };

  // TOP-CENTER placement untuk header
  const desktopHeaderTop = 16;

  return (
    <>
      <main
        data-theme={isLightMode ? "light" : "dark"}
        className={[
          isLightMode ? "bg-white text-black" : "bg-[#151515] text-white",
          "scroll-container relative w-screen h-screen overflow-y-scroll scroll-smooth transition-colors duration-1000",
          introBlur ? "intro-blur" : "",
        ].join(" ")}
      >
        {/* Stars */}
        <StarsNoSSR />
        <Aurora />

        {/* Header compact */}
        <CompactHeaderRow
          top={desktopHeaderTop}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isLightMode={isLightMode}
          triggerTransition={triggerTransition}
        />

        {/* Header lama (hidden) */}
        <div className="hidden">
          <AppHeader
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isLightMode={isLightMode}
            triggerTransition={triggerTransition}
          />
        </div>

        {/* === Teks Hero === */}
        <div className="absolute left-32 top-1/2 -translate-y-1/2 hero-text">
          <motion.h2
            initial={{ x: -160, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.8 }}
            className={`text-4xl font-bold ${isLightMode ? "text-black" : "text-white"} hero-h2`}
          >
            Hello, I Am
          </motion.h2>

          <motion.h3
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 110, damping: 24, mass: 0.9, delay: 0.3 }}
            onAnimationComplete={() => {
              setTimeout(() => setStartTypewriter(true), 500);
            }}
            className={`mt-2 text-6xl font-bold ${isLightMode ? "text-black" : "text-white"} hero-name`}
          >
            Darma Prastanto
          </motion.h3>

          <TypewriterText start={startTypewriter} isLightMode={isLightMode} />

          {/* Box: CV, Project, Hubungi Saya */}
          <AnimatePresence>
            {!introBlur && (
              <motion.div
                key="cvbox"
                initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.7, delay: 0.05 }}
                className="mt-3"
              >
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <CVBox
                    isLightMode={isLightMode}
                    href="https://drive.google.com/file/d/1c6tUI9xdFZ0JYEi3jhwbFvdCr45wG7JX/view?usp=sharing"
                  />
                  <ProjectBox
                    isLightMode={isLightMode}
                    href="#project"
                    label="Lihat Project"
                    align="left"
                  />
                  <HubungiSaya
                    isLightMode={isLightMode}
                    href="#contact"
                    label="Hubungi Saya"
                    align="left"
                    size="md"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Non-mobile 3D */}
        {!isMobile && (
          <div
            id="lanyard-section"
            className="col-span-50 relative px-4 sm:px-0 min-h-screen flex items-center justify-center lanyard-mobile ml-[40vw] -mt-[10px] [pointer-events:auto] [touch-action:none] [user-select:none] [webkit-user-select:none] z-[6]"
            onTouchStart={e => {
              try {
                e.preventDefault();
              } catch {}
            }}
            onTouchMove={e => {
              try {
                e.preventDefault();
              } catch {}
            }}
          >
            {webglOK ? (
              <LanyardDynamic position={[posX, 0, zPos]} gravity={[0, -40, 0]} />
            ) : (
              <div className="w-full max-w-xl h-[260px] grid place-items-center rounded-xl border border-black/10 dark:border-white/10 bg-white/5">
                <p className="text-sm text-black/70 dark:text-white/70">
                  WebGL tidak tersedia di perangkat ini.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Spacer mobile */}
        <div className="mobile-hero-spacer"></div>

        <AboutSection isLightMode={isLightMode} />
        <ProjectSection isLightMode={isLightMode} />
        <ContactSection isLightMode={isLightMode} />

        <ModeTransitionOverlay
          isAnimating={isAnimating}
          color={overlayColor}
          fromTop={fromTop}
          onAnimationEnd={handleAnimationEnd}
        />

        <style jsx global>{`
          .scroll-container {
            transition: filter 1s ease, background-color 1s ease, color 1s ease;
          }
          .intro-blur {
            filter: blur(12px);
          }

          [data-theme="light"] #lanyard-section,
          [data-theme="light"] #about,
          [data-theme="light"] #project,
          [data-theme="light"] #contact {
            background: #ffffff !important;
            background-color: #ffffff !important;
          }
          [data-theme="light"] #about > *,
          [data-theme="light"] #project > *,
          [data-theme="light"] #contact > * {
            background: transparent !important;
          }
          [data-theme="light"] #lanyard-section {
            background: transparent !important;
            background-color: transparent !important;
          }

          .hero-text {
            z-index: 5 !important;
            pointer-events: auto !important;
          }
          .hero-name,
          .hero-h2 {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }

          .typewriter-line {
            font-weight: 700;
          }
          [data-theme="dark"] .typewriter-line {
            background: linear-gradient(90deg, #22d3ee 0%, #60a5fa 45%, #a78bfa 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent !important;
            text-shadow: 0 0 6px rgba(167, 139, 250, 0.25);
          }
          [data-theme="light"] .typewriter-line {
            background: linear-gradient(90deg, #2563eb 0%, #6366f1 45%, #7c3aed 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent !important;
            text-shadow: none;
          }
          .typewriter-line .caret {
            color: #3b82f6 !important;
            -webkit-text-fill-color: #3b82f6 !important;
            background: none !important;
            text-shadow: none !important;
            opacity: 1 !important;
          }

          .lanyard-mobile,
          .lanyard-mobile canvas {
            pointer-events: auto !important;
            touch-action: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
          }

          .mobile-hero-spacer {
            height: 0;
          }

          :root {
            --lanyard-mobile-top: -1%;
            --lanyard-mobile-right: -350px;
            --lanyard-mobile-left: 10px;
            --lanyard-mobile-bottom: auto;

            --lanyard-scale-mobile: 0.7;

            --mobile-header-height: 100px;
            --mobile-header-sidepad: 10px;
            --mobile-header-gap: 12px;
            --mobile-icon-size: 18px;
            --mobile-font-size: 12px;
            --mobile-bottom-gap: 44px;

            --mobile-tooltip-gap: 10px;

            --hero-name-font-mobile: 44px;
            --hero-name-weight-mobile: 800;
            --hero-name-letter-mobile: -0.01em;
            --hero-name-line-mobile: 1.15;
          }

          @media (max-width: 640px) {
            .responsive-header {
              top: auto !important;
              bottom: calc(env(safe-area-inset-bottom) + var(--mobile-bottom-gap)) !important;
              left: 50% !important;
              transform: translateX(-50%) !important;
              height: var(--mobile-header-height) !important;
              width: calc(100vw - 20px) !important;
              z-index: 50 !important;
            }
            .header-shell {
              padding-left: var(--mobile-header-sidepad) !important;
              padding-right: var(--mobile-header-sidepad) !important;
              border-radius: 9999px !important;
              box-shadow: 0 8px 22px rgba(0, 0, 0, 0.28) !important;
            }
            .responsive-header nav {
              display: flex !important;
              position: static !important;
              width: 100% !important;
              padding: 0 !important;
              flex-direction: row !important;
              gap: var(--mobile-header-gap) !important;
            }

            .tooltip-chip {
              position: absolute !important;
              bottom: calc(100% + var(--mobile-tooltip-gap)) !important;
              left: 50% !important;
              transform: translateX(-50%) !important;
              font-size: var(--mobile-font-size) !important;
              padding: 2px 6px !important;
              z-index: 100 !important;
            }

            .divider-line {
              height: 18px !important;
              opacity: 0.7 !important;
            }

            /* ⬇️ DIPINDAH LEBIH KE ATAS DI MOBILE */
            .hero-text {
              left: 16px !important;
              right: 16px !important;
              top: 10% !important; /* ⬅️ moved up on mobile */
              transform: none !important;
              z-index: 5 !important;
            }

            .hero-h2 {
              font-size: 28px !important;
              line-height: 1.22 !important;
            }
            .hero-name {
              margin-top: 8px !important;
              font-size: var(--hero-name-font-mobile) !important;
              font-weight: var(--hero-name-weight-mobile) !important;
              letter-spacing: var(--hero-name-letter-mobile) !important;
              line-height: var(--hero-name-line-mobile) !important;
            }
            .typewriter-line {
              font-size: 24px !important;
              margin-top: 12px !important;
            }

            .cv-button {
              margin-top: 12px !important;
              padding: 10px 16px !important;
              font-size: 14px !important;
              border-radius: 10px !important;
            }

            #lanyard-section {
              margin-left: 0 !important;
              margin-top: 8px !important;
              min-height: 60vh !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            #lanyard-section > * {
              transform: scale(var(--lanyard-scale-mobile)) !important;
              transform-origin: top center !important;
              will-change: transform;
            }
            .lanyard-mobile {
              position: absolute !important;
              right: var(--lanyard-mobile-right) !important;
              left: var(--lanyard-mobile-left) !important;
              top: var(--lanyard-mobile-top) !important;
              bottom: var(--lanyard-mobile-bottom) !important;
              width: auto !important;
              height: auto !important;
              min-height: 0 !important;
              transform: none !important;
              display: block !important;
              z-index: 6 !important;
              pointer-events: auto !important;
              touch-action: none !important;
            }
            .lanyard-mobile canvas {
              pointer-events: auto !important;
              touch-action: none !important;
            }

            .mobile-hero-spacer {
              height: 68vh !important;
            }

            .scroll-container {
              padding-bottom: calc(
                var(--mobile-header-height) + var(--mobile-bottom-gap) +
                  env(safe-area-inset-bottom) + 20px
              ) !important;
            }
          }

          @media (max-width: 380px) {
            :root {
              --hero-name-font-mobile: 40px;
            }
            #lanyard-section > * {
              transform: scale(calc(var(--lanyard-scale-mobile) - 0.04)) !important;
            }
            .mobile-hero-spacer {
              height: 72vh !important;
            }
          }

          @media (min-width: 641px) and (max-width: 768px) {
            .responsive-header {
              top: 700px !important;
              height: 55px !important;
            }
            .hero-h2 {
              font-size: 24px !important;
            }
            .hero-name {
              font-size: 40px !important;
            }
            .typewriter-line {
              font-size: 20px !important;
            }
          }

          :root {
            --lanyard-scale-desktop: 1.5;
          }

          @media (min-width: 1024px) {
            .responsive-header {
              height: 55px !important;
              bottom: auto !important;
            }
          }

          /* Compact header overrides */
          .appheader-compact > div {
            height: 48px !important;
            padding-left: 8px !important;
            padding-right: 8px !important;
            border-radius: 9999px !important;
          }
          .appheader-compact button {
            height: 40px !important;
            padding-left: 10px !important;
            padding-right: 10px !important;
            border-radius: 9999px !important;
          }
          .appheader-compact > div > div + div {
            width: 1px !important;
            height: 20px !important;
          }
          .logo-compact > div {
            width: 48px !important;
            height: 48px !important;
            border-radius: 9999px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .compact-header-row {
            gap: 4px !important;
          }
          .logo-compact {
            margin-right: -2px !important;
          }
        `}</style>
      </main>
    </>
  );
}