"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import CertificatesBox from "./CertificatesBox";
import ProjectsBox from "./ProjectsBox"; // ← tambahkan import

type AboutSectionProps = {
  isLightMode: boolean;
  dock?: "left" | "center" | "right";
  offsetX?: number;
  offsetY?: number;
  darkBg?: string;

  /** Geser posisi CANVAS (cover) secara independen */
  coverShift?: string; // contoh: "md:-translate-y-3"
  /** Jarak GRID terhadap cover secara independen */
  gridMargin?: string; // contoh: "mt-2 sm:mt-3 md:mt-2 lg:mt-3 xl:mt-4"
};

export default function AboutSection({
  isLightMode,
  dock = "left",
  offsetX = 0,
  offsetY = 0,
  darkBg,

  // Posisi cover TETAP
  coverShift = "md:-translate-y-6",
  // Grid lebih dempet ke cover
  gridMargin = "mt-0 sm:mt-1 md:mt-0 lg:mt-1 xl:mt-1",
}: AboutSectionProps) {
  const aboutRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = aboutRef.current;
    if (!el) return;

    const onIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          try {
            const url = new URL(window.location.href);
            url.hash = "about";
            window.history.replaceState(null, "", url);
          } catch {}
          window.dispatchEvent(
            new CustomEvent("activeSectionChange", { detail: "about" })
          );
          document.body.setAttribute("data-active-section", "about");
        } else {
          if (document.body.getAttribute("data-active-section") === "about") {
            document.body.removeAttribute("data-active-section");
          }
        }
      });
    };

    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    });

    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ===== Variants "POP UP" =====
  const popCoverVariants: Variants = {
    hidden: { opacity: 0, scale: 0.85, y: 12 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 220, damping: 20 },
    },
  };

  const popTextVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 8 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { delay: 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      id="about"
      ref={aboutRef}
      className={`relative min-h-screen flex items-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-24
        pt-20 md:pt-16
        pr-6 sm:pr-8 md:pr-12 lg:pr-16 xl:pr-24 2xl:pr-32
        ${
          isLightMode
            ? "bg-gradient-to-br from-white via-gray-100 to-gray-200 text-black"
            : "bg-transparent text-white"
        }
        pt-28
      `}
    >
      {/* ===== Marquee TOP — GERAK KIRI ===== */}
      <div className="absolute inset-x-0 top-0 z-40 pointer-events-none overflow-x-hidden overflow-y-visible h-[56px] sm:h-[64px] md:h-[80px]">
        <motion.div
          initial={{ x: "0%" }}
          animate={{ x: "-50%" }}
          transition={{ duration: 32, ease: "linear", repeat: Infinity }}
          className={`about-belt w-[200%] inline-flex items-center px-4 sm:px-6 uppercase font-extrabold tracking-wider 
            text-2xl sm:text-3xl md:text-4xl
            leading-[56px] sm:leading-[64px] md:leading-[80px]
            ${isLightMode ? "text-black" : "text-white"} 
            gap-8 sm:gap-12 md:gap-16`}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={`t1-${i}`} className="about-item">
              <span
                className={`about-accent ${
                  isLightMode ? "about-accent--light" : "about-accent--dark"
                }`}
              >
                About
              </span>
              &nbsp;Me
            </span>
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={`t1b-${i}`} className="about-item" aria-hidden="true">
              <span
                className={`about-accent ${
                  isLightMode ? "about-accent--light" : "about-accent--dark"
                }`}
              >
                About
              </span>
              &nbsp;Me
            </span>
          ))}
        </motion.div>
      </div>

      {/* ===== Marquee KEDUA — GERAK KANAN ===== */}
      <div className="absolute inset-x-0 top-8 sm:top-10 z-40 pointer-events-none overflow-x-hidden overflow-y-visible h-[48px] sm:h-[56px] md:h-[72px] mb-2 sm:mb-0">
        <motion.div
          initial={{ x: "-50%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 32, ease: "linear", repeat: Infinity }}
          className={`about-belt about-belt--right ${
            isLightMode ? "belt-right-light" : "belt-right-dark"
          } w-[200%] inline-flex items-center px-4 sm:px-6 uppercase font-extrabold tracking-wider 
            text-xl sm:text-2xl md:text-3xl
            leading-[48px] sm:leading-[56px] md:leading-[72px]
            ${isLightMode ? "text-black/80" : "text-white/80"} 
            gap-7 sm:gap-10 md:gap-14`}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={`t2-${i}`} className="about-item">
              <span
                className={`about-accent ${
                  isLightMode ? "about-accent--light" : "about-accent--dark"
                }`}
              >
                About
              </span>
              &nbsp;Me
            </span>
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={`t2b-${i}`} className="about-item" aria-hidden="true">
              <span
                className={`about-accent ${
                  isLightMode ? "about-accent--light" : "about-accent--dark"
                }`}
              >
                About
              </span>
              &nbsp;Me
            </span>
          ))}
        </motion.div>
      </div>

      {/* ====== KONTEN: dua kolom ====== */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:gap-10 lg:gap-12 xl:gap-14">
          {/* KIRI: ProfileCard */}
          <div
            className={[
              "mx-auto md:mx-0 shrink-0",
              "w-[260px] sm:w-[320px] md:w-[360px] max-w-full",
              "transform-gpu origin-top-left scale-[0.96] sm:scale-100",
              "mt-10 sm:mt-6 md:mt-0",
            ].join(" ")}
          >
            <ProfileCard
              name=""
              title=""
              handle="Darma Prastanto"
              status=""
              contactText=""
              avatarUrl="/ProfileCard/avatar.png"
              miniAvatarUrl="/ProfileCard/avatar.png"
              showUserInfo
              enableTilt
              enableMobileTilt={false}
            />
          </div>

          {/* KANAN: COVER */}
          <div
            className={`
              w-full
              md:max-w-[calc(100%-420px)] lg:max-w-[calc(100%-460px)] xl:max-w-[calc(100%-500px)]
              mt-6 md:mt-0 md:ml-auto
              md:mr-8 lg:mr-12 xl:mr-20 2xl:mr-24
            `}
          >
            {/* Posisi cover TETAP */}
            <div className={`md:transform-gpu will-change-transform ${coverShift}`}>
              <motion.div
                variants={popCoverVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                className={`
                  rounded-2xl border shadow-lg
                  ${isLightMode ? "border-black/20" : "border-white/25"}
                  bg-transparent
                  p-5 sm:p-6 md:p-7
                `}
                aria-label="Canvas Tentang Saya"
              >
                <motion.div
                  variants={popTextVariants}
                  className={`space-y-3 leading-relaxed ${
                    isLightMode ? "text-black/80" : "text-white/85"
                  }`}
                >
                  <p>
                    <strong>Halo, saya Darma Prastanto</strong> — desainer grafis dan
                    animator 2D.
                  </p>
                  <p>
                    Saya memiliki keahli membuat aset vektor, rigging sederhana, serta
                    animasi. Saya selalu bersemangat mempelajari hal baru dan langsung
                    menerapkannya dalam proses kerja.
                  </p>

                  <div className="pt-2">
                    <p className="font-semibold mb-2">
                      Contoh hal yang sedang/sering saya pelajari:
                    </p>
                    <ul className="list-disc ml-5 space-y-1">
                      <li>
                        <strong>After Effects</strong> — alat untuk membuat animasi 2D
                        (komposit, puppet, parallax).
                      </li>
                      <li>
                        <strong>Illustrator &amp; CorelDRAW</strong> — untuk menggambar
                        bentuk logo, ikon, dan karakter (asset vector yang rapi &amp;
                        konsisten).
                      </li>
                      <li>
                        <strong>Figma</strong> — platform desain &amp; prototipe berbasis
                        web untuk merancang tampilan antarmuka (UI/UX) produk digital
                        seperti website &amp; aplikasi.
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* ===== GRID/BOX TRANSPARAN DI BAWAH COVER ===== */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
              className={`${gridMargin}`}
            >
              <div className="mx-auto flex flex-wrap justify-center items-start gap-3 w-fit">
                {/* Klik → langsung ke tab Certificates di BottomBar */}
                <CertificatesBox
                  isLightMode={isLightMode}
                  scrollTargetId="project"
                  tabId="certificates"
                  syncUrlQuery
                />
                {/* Box Project (tambahan, tanpa mengubah baris lain) */}
                <ProjectsBox
                  isLightMode={isLightMode}
                  scrollTargetId="project"
                  tabId="project"
                  syncUrlQuery
                />
              </div>
            </motion.div>
            {/* ===== END GRID ===== */}
          </div>
        </div>
      </div>

      {/* ===== CSS LOKAL ===== */}
      <style jsx>{`
        .about-accent {
          font-weight: 900;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
        .about-accent--light {
          background-image: linear-gradient(90deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%);
        }
        .about-accent--dark {
          background-image: linear-gradient(90deg, #38bdf8 0%, #22d3ee 50%, #a78bfa 100%);
          text-shadow: 0 0 10px rgba(56, 189, 248, 0.25), 0 0 18px rgba(167, 139, 250, 0.18);
        }
        .about-belt > .about-item {
          position: relative;
          white-space: nowrap;
          display: inline-flex !important;
          align-items: center !important;
          padding-left: 22px;
          padding-right: 40px !important;
        }
        .about-belt > .about-item::before,
        .about-belt > .about-item::after {
          content: "";
          position: absolute !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          width: clamp(6px, 0.9vw, 10px);
          height: clamp(6px, 0.9vw, 10px);
          border-radius: 9999px;
          background: #ffffff !important;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
          pointer-events: none;
        }
        .about-belt > .about-item::before { left: 0.125rem !important; }
        .about-belt > .about-item::after { right: 0.125rem !important; }
        .about-belt > .about-item[aria-hidden="true"]:last-child::after { display: none !important; }

        .about-belt--right { font-weight: 800 !important; }
        .belt-right-dark { color: #ffffff !important; }
        .belt-right-light { color: #000000 !important; }
      `}</style>
    </section>
  );
}
