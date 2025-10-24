// app/home/Contact/ContactSection.tsx
"use client";

import Image from "next/image";
import Sosmed from "./SosmedBox";

type ContactSectionProps = {
  isLightMode: boolean;
  darkBg?: string;
};

export default function ContactSection({
  isLightMode,
  darkBg = "#151515ff",
}: ContactSectionProps) {
  return (
    <section
      id="contact"
      className={[
        "relative flex items-center justify-center px-6 overflow-x-hidden",
        // ruang untuk heading+paragraf + Sosmed + porto.png + footer
        "min-h-[108vh] sm:min-h-[130vh] lg:min-h-[145vh] xl:min-h-[160vh]",
        "pb-[14rem] sm:pb-[22rem] lg:pb-[26rem] xl:pb-[30rem]",
        isLightMode
          ? "bg-gradient-to-br from-white via-gray-100 to-gray-200 text-black"
          : "contact-dark text-white",
      ].join(" ")}
    >
      {/* ===== Konten utama: Heading + Paragraf (tanpa ContactForm) ===== */}
      <div className="max-w-3xl text-center z-[3]">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
          <span className="font-extrabold text-transparent bg-clip-text bg-[linear-gradient(90deg,#19D7FF_0%,#24D8C0_50%,#2BD985_100%)]">
            GET IN
          </span>{" "}
          TOUCH
        </h2>

        <p className="mb-8 sm:mb-10 opacity-90">
          Jika ingin terhubung dengan saya, silakan gunakan tautan sosial di bawah
          ini. Atau  bekerja sama jangan ragu untuk menghubungi saya melalui informasi kontak di bawah ini.
        </p>

        {/* ===== Hanya SosmedBox (ContactForm TIDAK dirender) ===== */}
        <div className="w-full grid place-items-center">
          <Sosmed align="center" />
        </div>
      </div>

      {/* ===== PNG PORTO (tetap tampil) =====
          Mobile: diturunkan -> top-[90%]
          ≥ sm: kembali seperti semula -> sm:top-[75%]
      */}
      <figure
        className="
          pointer-events-none select-none
          absolute left-1/2 top-[90%] sm:top-[75%] -translate-x-1/2 -translate-y-1/2
          z-[1]
        "
        aria-hidden
      >
        <Image
          src="/porto.png"
          alt="Porto Darma"
          width={1600}
          height={900}
          sizes="(min-width:1536px) 62vw, (min-width:1280px) 60vw, (min-width:1024px) 58vw, (min-width:768px) 72vw, 86vw"
          className="
            h-auto
            w-[86vw] sm:w-[72vw] md:w-[58vw] xl:w-[60vw] 2xl:w-[62vw]
            max-w-[1200px] 2xl:max-w-[1300px]
            object-contain
          "
          priority
        />
      </figure>

      {/* ===== Footer / Watermark (tetap tampil) ===== */}
      <footer
        className={[
          "absolute inset-x-0 bottom-0 sm:bottom-10 text-center text-xs sm:text-sm select-none",
          isLightMode ? "text-black" : "text-white",
        ].join(" ")}
      >
        <div className="px-4">
          <div>© 2025 Darma Prastanto. All rights reserved.</div>
          <div className="mt-1 opacity-80">
            Built with — using React, TypeScript, Tailwind CSS, and Framer Motion.
          </div>
        </div>
      </footer>

      <style jsx>{`
        :root {
          --contact-dark-bg: ${darkBg};
        }
        .contact-dark {
          background: var(--contact-dark-bg);
        }
      `}</style>
    </section>
  );
}
