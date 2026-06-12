// app/home/Project/ProjectSection.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import BottomTabs from "./Tabs/BottomTabs";
import PanelContainer from "./Panels/PanelContainer";
import ProjectsPanel from "./Panels/ProjectsPanel";
import CertificateDOT from "./ProjectItems/CertificateDOT";
import CertificateTOEFL from "./ProjectItems/CertificateTOEFL";
import CertificatePesertaLombaDesain from "./ProjectItems/CertificatePesertaLombaDesain";
import CertificateBapas from "./ProjectItems/CertificateBapas"; 
import CertificateKemnaker from "./ProjectItems/CertificateKemnaker"; // ✅ Import sertifikat kemnaker baru
import TechStackPanel from "./Panels/TechStackPanel";

// Import ProjectBox
import ProjectBox from "../../components/LihatProject/LihatProject";

type Props = {
  isLightMode: boolean;
  x?: number;
  y?: number;
  w?: number;
};

export default function ProjectSection({
  isLightMode,
  x = 275,
  y = -95,
  w = 980,
}: Props) {
  const [active, setActive] = useState<"projects" | "certs" | "stack">("projects");

  return (
    <section
      id="project"
      className={[
        "relative overflow-hidden min-h-screen",
        "pt-6 sm:pt-8 md:pt-[200px] lg:pt-[300px]",
        "pb-10 sm:pb-14",
        isLightMode ? "bg-transparent text-black" : "bg-transparent text-white",
      ].join(" ")}
    >
      {/* Desktop hero */}
      <div className="hidden md:block absolute left-[275px] top-[-95px] w-[980px]">
        <div className="relative w-full h-auto">
          <Image
            src="/Project/my-project.png"
            alt="My Project Illustration"
            priority
            className="w-full h-auto select-none"
            width={w}
            height={Math.round((w * 9) / 16)}
            sizes={`${w}px`}
          />
        </div>
      </div>

      {/* Mobile hero */}
      <div className="md:hidden flex justify-center">
        <div className="relative w-[96vw] max-w-[740px] scale-[1.40] origin-top">
          <Image
            src="/Project/my-project.png"
            alt="My Project Illustration"
            priority
            className="w-full h-auto select-none"
            width={740}
            height={416}
            sizes="96vw"
          />
        </div>
      </div>

      {/* CTA ProjectBox (Hidden) */}
      <div className="mt-4 flex justify-center hidden">
        <ProjectBox isLightMode={isLightMode} href="/project" />
      </div>

      {/* Tabs */}
      <div className="mt-4 sm:mt-6">
        <div className="mx-auto w-full max-w-[740px] md:max-w-[820px]">
          <div
            className={[
              "rounded-3xl border px-4 sm:px-6 md:px-7 py-3.5 sm:py-4 md:py-5",
              "backdrop-blur-sm shadow-[0_10px_30px_-12px_rgba(37,99,235,0.45)]",
              "bg-blue-500/25 border-blue-400/30",
            ].join(" ")}
          >
            <BottomTabs isLightMode={isLightMode} active={active} onChange={setActive} />
          </div>
        </div>
      </div>

      {/* PanelContainer */}
      <div className="mt-[1cm]">
        <PanelContainer
          innerMaxWClass={active === "certs" ? "max-w-[780px] md:max-w-4xl w-full" : "max-w-[420px]"}
          contentPaddingClass="p-[0.5cm]"
          outerClassName="px-[1cm] sm:px-0"
          outlined
          shrinkDesktop={active !== "certs"}
        >
          {active === "projects" ? (
            <ProjectsPanel isLightMode={isLightMode} />
          ) : active === "certs" ? (
            /* Urutan diletakkan berurutan dari atas ke bawah */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 justify-items-center w-full h-auto clear-both">
              {/* Baris Atas (Sertifikat Lama) */}
              <CertificateDOT />
              <CertificateTOEFL />
              <CertificatePesertaLombaDesain />
              
              {/* Baris Bawah (Sertifikat Baru Anda) */}
              <CertificateBapas /> 
              <CertificateKemnaker />
            </div>
          ) : (
            // ==== PANEL TECH STACK ====
            <div className="flex items-center justify-center py-6">
              <TechStackPanel isLightMode={isLightMode} />
            </div>
          )}
        </PanelContainer>
      </div>
    </section>
  );
}