"use client";

import Image from "next/image";
import { CornerUpRight } from "lucide-react";
import StarBorder from "../../components/Effects/StarBorder";

type SosmedProps = {
  className?: string;
  align?: "left" | "center";
  borderColor?: string;
  thickness?: number;
  speed?: string;

  igHref?: string;
  gmailTo?: string;
  linkedinHref?: string;

  heading?: string;
};

export default function Sosmed({
  className,
  align = "left",
  borderColor = "rgba(168,85,247,0.9)",
  thickness = 2,
  speed = "6s",

  igHref = "https://www.instagram.com/darmaaaprs__?igsh=aXg0d3k0aGM5dmxk",
  gmailTo = "mailto:darmaprastanto1d@gmail.com",
  linkedinHref = "https://www.linkedin.com/in/darma-prastanto-b40266234/",

  heading = "Terhubung Dengan Saya",
}: SosmedProps) {
  
  const dockClass =
    align === "left"
      ? "justify-self-start self-start place-self-start"
      : "mx-auto";

  const CARD_BASE =
    "group rounded-xl block overflow-hidden px-4 sm:px-5 py-3 sm:py-4 min-h-[72px] " +
    "transition-transform duration-300 ease-out transform-gpu will-change-transform";
    
  const CARD_HOVER =
    "hover:scale-[1.05] hover:-translate-y-1 " +
    "hover:shadow-[0_24px_80px_-20px_rgba(0,0,0,0.55)] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 " +
    "focus-visible:scale-[1.035]";

  return (
    /* - Mengubah dari motion.div menjadi div biasa (Menghapus seluruh logika sensor scroll & koordinat x)
      - Menghapus margin negatif desktop lama (md:ml-[-4cm] md:mr-[5cm]) agar pas berada di sisi kiri form tanpa melenceng keluar layar
    */
    <div
      className={[
        "w-full max-w-[92vw] shrink-0", // mobile
        "md:w-[12cm] md:max-w-none",     // ukuran kotak di desktop tetap 12cm
        dockClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <StarBorder
        as="div"
        className="block w-full rounded-[20px]"
        color={borderColor}
        speed={speed}
        thickness={thickness}
      >
        {/* Heading mojok kiri atas + list kartu */}
        <div className="rounded-[20px] pt-2 sm:pt-3 pb-4 sm:pb-5">
          <h4 className="pl-2 sm:pl-3 text-white font-extrabold text-xl sm:text-2xl leading-none text-left">
            {heading}
          </h4>

          <div className="mt-3 sm:mt-4 px-3 sm:px-4 space-y-3 sm:space-y-4">
            {/* ===== Instagram ===== */}
            <a
              href={igHref}
              target="_blank"
              rel="noreferrer"
              className={[
                CARD_BASE,
                CARD_HOVER,
                "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 text-white",
              ].join(" ")}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0 grid place-items-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 overflow-hidden">
                  <Image
                    src="/Ikon_Ig.png"
                    alt="Instagram"
                    width={32}
                    height={32}
                    className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-base sm:text-lg font-semibold leading-tight truncate flex items-center">
                    <span>Instagram</span>
                  </div>
                  <div className="text-sm sm:text-base/5 opacity-95 truncate">
                    Ikuti Instagram saya
                  </div>
                </div>

                <div className="ml-auto flex-shrink-0">
                  <div className="grid place-items-center w-8 h-8 rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1">
                    <CornerUpRight className="w-4 h-4 -rotate-12" />
                  </div>
                </div>
              </div>
            </a>

            {/* ===== Gmail ===== */}
            <a
              href={gmailTo}
              className={[
                CARD_BASE,
                CARD_HOVER,
                "text-white",
                "bg-[linear-gradient(90deg,#F38B2B_0%,#E53935_35%,#4285F4_70%,#34A853_100%)]",
              ].join(" ")}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0 grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 overflow-hidden">
                  <Image
                    src="/Ikon_Gmail.png"
                    alt="Gmail"
                    width={24}
                    height={24}
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-base sm:text-lg font-semibold leading-tight truncate flex items-center">
                    <span>Gmail</span>
                  </div>
                  <div className="text-sm sm:text-base/5 opacity-95 truncate">
                    kirim pesan ke email saya
                  </div>
                </div>

                <div className="ml-auto flex-shrink-0">
                  <div className="grid place-items-center w-8 h-8 rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1">
                    <CornerUpRight className="w-4 h-4 -rotate-12" />
                  </div>
                </div>
              </div>
            </a>

            {/* ===== LinkedIn ===== */}
            <a
              href={linkedinHref}
              target="_blank"
              rel="noreferrer"
              className={[
                CARD_BASE,
                CARD_HOVER,
                "text-white",
                "bg-[linear-gradient(90deg,#0B2A8B_0%,#1843A3_35%,#2C6DD5_70%,#4A90E2_100%)]",
              ].join(" ")}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0 grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M20.45 20.45h-3.55v-5.6c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7H9.32V9h3.41v1.56h.05c.48-.9 1.66-1.85 3.42-1.85 3.66 0 4.33 2.41 4.33 5.54v6.2zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <div className="text-base sm:text-lg font-semibold leading-tight truncate flex items-center gap-1">
                    <span>Linked</span>
                    <span className="inline-block rounded-[6px] bg-white px-1.5 py-0.5 leading-none text-[12px] sm:text-[13px] font-extrabold text-[#0A66C2]">
                      in
                    </span>
                  </div>
                  <div className="text-sm sm:text-base/5 opacity-95 truncate">
                    Terhubung di LinkedIn
                  </div>
                </div>

                <div className="ml-auto flex-shrink-0">
                  <div className="grid place-items-center w-8 h-8 rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1">
                    <CornerUpRight className="w-4 h-4 -rotate-12" />
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </StarBorder>
    </div>
  );
}