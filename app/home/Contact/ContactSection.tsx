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
        "relative flex items-center justify-center px-6 overflow-x-hidden",
        // mempertahankan ruang tinggi asli bawaan Anda
        "min-h-[108vh] sm:min-h-[130vh] lg:min-h-[145vh] xl:min-h-[160vh]",
        "pb-[14rem] sm:pb-[22rem] lg:pb-[26rem] xl:pb-[30rem]",
        isLightMode
          ? "bg-gradient-to-br from-white via-gray-100 to-gray-200 text-black"
          : "contact-dark text-white",
      ].join(" ")}
    >
      {/* ===== Konten utama: Diperlebar ke max-w-5xl agar grid kiri-kanan lega ===== */}
      <div className="w-full max-w-5xl text-center z-[3]">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
          <span className="font-extrabold text-transparent bg-clip-text bg-[linear-gradient(90deg,#19D7FF_0%,#24D8C0_50%,#2BD985_100%)]">
            GET IN
          </span>{" "}
          TOUCH
        </h2>

        <p className="mb-12 max-w-2xl mx-auto opacity-90">
          Jika ingin terhubung dengan saya, silakan gunakan tautan sosial di bawah
          ini. Atau bekerja sama jangan ragu untuk menghubungi saya melalui informasi kontak di bawah ini.
        </p>

        {/* Sistem Layout Grid Pendukung: 
          - Layar HP: Otomatis menumpuk satu kolom vertikal (atas-bawah)
          - Layar Komputer/Laptop (lg): Berdampingan seimbang (kiri & kanan)
        */}
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

      {/* ===== PNG PORTO (PERBAIKAN: Posisi responsif top-[82%] di HP agar tidak menabrak footer) ===== */}
      <figure
        className="
          pointer-events-none select-none
          absolute left-[48%] top-[82%] sm:top-[75%] -translate-x-1/2 -translate-y-1/2
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

      {/* ===== Footer / Watermark (PERBAIKAN: Ditambahkan z-[2] dan padding pengaman agar tidak tertutup gambar) ===== */}
      <footer
        className={[
          "absolute inset-x-0 bottom-0 sm:bottom-10 text-center text-xs sm:text-sm select-none z-[2]",
          "pb-4 pt-10 sm:pb-0 sm:pt-0", // memberi ruang padding di HP
          // memberikan gradasi shadow tipis di HP agar teks kontras dan super jelas jika dilewati ujung gambar
          isLightMode 
            ? "text-black bg-gradient-to-t from-white/90 via-white/40 to-transparent sm:bg-none" 
            : "text-white bg-gradient-to-t from-[#151515]/90 via-[#151515]/30 to-transparent sm:bg-none",
        ].join(" ")}
      >
        <div className="px-4">
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