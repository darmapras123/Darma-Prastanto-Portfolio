"use client";

import Image from "next/image";
import Sosmed from "./SosmedBox";
// Mengimpor file form baru yang baru saja kita pisahkan
import FormPesanLangsung from "./FormPesanLangsung";

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
        "relative flex flex-col sm:flex-row items-center justify-center px-6 overflow-x-hidden",
        // Menyesuaikan tinggi ruang: h-auto di HP agar fleksibel, min-h asli Anda di Laptop
        "h-auto sm:min-h-[130vh] lg:min-h-[145vh] xl:min-h-[160vh]",
        "pt-12 pb-8 sm:pb-[22rem] lg:pb-[26rem] xl:pb-[30rem]",
        isLightMode
          ? "bg-gradient-to-br from-white via-gray-100 to-gray-200 text-black"
          : "contact-dark text-white",
      ].join(" ")}
    >
      {/* ===== Konten utama: Grid Atas (Form & Sosmed) ===== */}
      <div className="w-full max-w-5xl text-center z-[3] mb-4 sm:mb-0">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
          <span className="font-extrabold text-transparent bg-clip-text bg-[linear-gradient(90deg,#19D7FF_0%,#24D8C0_50%,#2BD985_100%)]">
            GET IN
          </span>{" "}
          TOUCH
        </h2>

        <p className="mb-8 max-w-2xl mx-auto opacity-90 text-sm sm:text-base">
          Jika ingin terhubung dengan saya, silakan gunakan tautan sosial di bawah
          ini. Atau bekerja sama jangan ragu untuk menghubungi saya melalui informasi kontak di bawah ini.
        </p>

        {/* Sistem Layout Grid Pendukung */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full mt-4">
          
          {/* SISI KIRI: Kotak Terhubung Dengan Saya (SosmedBox) */}
          <div className="w-full flex justify-center lg:justify-end">
            <Sosmed align="center" />
          </div>

          {/* SISI KANAN: Memanggil Komentar Form Baru ke Posisi Kanan Kotak Sosmed */}
          <div className="w-full flex justify-center lg:justify-start">
            <FormPesanLangsung isLightMode={isLightMode} />
          </div>

        </div>
      </div>

      {/* ===== PNG PORTO (PERBAIKAN: Mengatur my-2 di HP agar jarak dengan tombol di atasnya pas & ideal) ===== */}
      <figure
        className="
          pointer-events-none select-none
          relative sm:absolute 
          left-0 sm:left-[48%] 
          top-0 sm:top-[75%] 
          transform-none sm:-translate-x-1/2 sm:-translate-y-1/2
          mx-auto flex justify-center
          z-[1] w-full
          my-2 sm:my-0
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

      {/* ===== Footer / Watermark (PERBAIKAN: Mengatur mt-6 di HP agar jarak dari gambar ke teks pas & seimbang) ===== */}
      <footer
        className={[
          "relative sm:absolute inset-x-0 bottom-0 sm:bottom-10 text-center text-xs sm:text-sm select-none z-[2]",
          "w-full mt-6 sm:mt-0 px-4",
          isLightMode ? "text-black" : "text-white",
        ].join(" ")}
      >
        <div>
          <div className="font-medium">© 2025 Darma Prastanto. All rights reserved.</div>
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