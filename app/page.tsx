"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [percent, setPercent] = useState(0);
  const [transitionOut, setTransitionOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // ✅ Prefetch halaman tujuan lebih awal supaya tidak ada jeda "hitam"
    router.prefetch("/home");

    sessionStorage.removeItem("redirectedToHome");

    let progress = 0;
    let interval: NodeJS.Timeout;

    const runFast = () => {
      interval = setInterval(() => {
        progress++;
        setPercent(progress);
        if (progress >= 90) {
          clearInterval(interval);
          runSlow();
        }
      }, 40);
    };

    const runSlow = () => {
      interval = setInterval(() => {
        progress++;
        setPercent(progress);
        if (progress >= 100) {
          clearInterval(interval);

          setTransitionOut(true);
          setTimeout(() => {
            sessionStorage.setItem("redirectedToHome", "true");
            router.push("/home");
          }, 1000); // tunggu animasi blur selesai
        }
      }, 200);
    };

    runFast();
    return () => clearInterval(interval);
  }, [router]);

  return (
    <main className={`wrapper ${transitionOut ? "blur-out" : ""}`}>
      {/* === Animasi Stroke Text === */}
      <svg viewBox="0 0 1000 200">
        <text x="50%" y="50%" dy=".35em" textAnchor="middle">
          Darma Prastanto
        </text>
      </svg>

      {/* === Ikon Sosial === */}
      <nav className="socials">
        <a
          className="icon instagram"
          href="https://www.instagram.com/darmaaaprs__"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            {/* Gradien untuk stroke & fill Instagram */}
            <defs>
              <linearGradient id="igStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F58529" />
                <stop offset="50%" stopColor="#DD2A7B" />
                <stop offset="100%" stopColor="#8134AF" />
              </linearGradient>
              <linearGradient id="igFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEDA77" />
                <stop offset="50%" stopColor="#F58529" />
                <stop offset="100%" stopColor="#DD2A7B" />
              </linearGradient>
            </defs>
            <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 
                     2.24 5 5 5h10c2.76 0 5-2.24 
                     5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.66 0 
                     3 1.34 3 3v10c0 1.66-1.34 
                     3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 
                     1.34-3 3-3zm10.5 1a1.5 1.5 0 100 3 
                     1.5 1.5 0 000-3zM12 7a5 5 0 100 
                     10 5 5 0 000-10zm0 2a3 3 0 
                     110 6 3 3 0 010-6z" />
          </svg>
        </a>

        {/* === EMAIL (Gmail berwarna, TANPA border putih, auto-fit ke box) === */}
        <a
          className="icon email"
          href="mailto:darmaprastanto1d@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Email"
        >
          {/* M multicolor dengan garis tebal; tidak ada rect border */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            {/* Empat segmen M (garis berwarna) */}
            {/* Biru (kaki kiri) */}
            <path
              className="gm gm-blue"
              d="M5 6 L5 18"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Merah (diagonal kiri-atas ke tengah) */}
            <path
              className="gm gm-red"
              d="M5 6 L12 11.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Kuning (diagonal tengah ke kanan-atas) */}
            <path
              className="gm gm-yellow"
              d="M12 11.5 L19 6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Hijau (kaki kanan) */}
            <path
              className="gm gm-green"
              d="M19 6 L19 18"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </nav>

      {/* === Loader Lingkaran + Persen === */}
      <div className="loader">
        {percent > 0 && <div className="percent">{percent}%</div>}
      </div>

      <style jsx>{`
        main {
          background: #000000ff;
          height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: 120px;
          position: relative;
          color: #fff;
          transition: opacity 0.8s ease, filter 1s ease;
        }
        .blur-out {
          opacity: 0;
          filter: blur(20px);
        }
        /* Animasi stroke text */
        svg {
          font-family: "Russo One", sans-serif;
          width: 100%;
          max-width: 1000px;
          height: 160px;
        }
        svg text {
          animation: stroke 5s forwards;
          stroke-width: 2;
          stroke: #fff;
          font-size: 80px;
          text-transform: uppercase;
          fill: transparent;
        }
        @keyframes stroke {
          0% { fill: rgba(255,255,255,0); stroke: rgba(255,255,255,1); stroke-dashoffset: 25%; stroke-dasharray: 0 50%; }
          70% { fill: rgba(255,255,255,0); stroke: rgba(255,255,255,1); }
          90% { fill: rgba(255,255,255,0); stroke: rgba(255,255,255,1); stroke-width: 2.5; }
          100% { fill: #fff; stroke: rgba(255,255,255,0); stroke-dashoffset: -25%; stroke-dasharray: 50% 0; stroke-width: 0; }
        }

        /* Ikon sosial */
        .socials {
          display: flex;
          justify-content: center;
          margin-top: 8px;
          gap: 6px;
        }
        .icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
          opacity: 0;
          transform: translateY(20px) scale(1);
          animation: slideUp 0.8s ease forwards;
          cursor: pointer;
        }
        .icon:nth-child(1) { animation-delay: 0.6s; }
        .icon:nth-child(2) { animation-delay: 1s; }
        .icon:hover { background: #888888; transform: scale(1.1); box-shadow: none; }

        /* default ukuran svg ikon */
        .icon svg { width: 78%; height: 78%; }

        /* === OVERRIDE: Gmail full-fit ke box (tanpa border putih) === */
        .icon.email svg { width: 100%; height: 100%; }   /* penuhi box */
        .icon.email .gm {
          stroke-width: 3.8;             /* tebal supaya terlihat “terisi” */
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          fill: transparent;
          animation: strokeIconColor 1.2s forwards; /* gambar garis berwarna */
        }
        .icon.email .gm-blue   { stroke: #4285F4; } /* Biru */
        .icon.email .gm-red    { stroke: #EA4335; } /* Merah */
        .icon.email .gm-yellow { stroke: #FBBC05; } /* Kuning */
        .icon.email .gm-green  { stroke: #34A853; } /* Hijau */

        /* Stagger kecil untuk urutan animasi */
        .icon.email .gm-blue   { animation-delay: 0.25s; }
        .icon.email .gm-red    { animation-delay: 0.40s; }
        .icon.email .gm-yellow { animation-delay: 0.55s; }
        .icon.email .gm-green  { animation-delay: 0.70s; }

        /* Default animasi untuk ikon lain (Instagram, dll) */
        .icon svg path,
        .icon svg rect,
        .icon svg polyline,
        .icon svg line {
          stroke: #fff;
          stroke-width: 1.6;
          fill: transparent;
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: strokeIcon 2s forwards;
        }
        /* Instagram tetap gradien & keyframes khusus */
        .icon.instagram svg path { stroke: url(#igStroke); animation-name: strokeIconIG; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(1); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        /* Fallback (ikon lain): isi putih di akhir */
        @keyframes strokeIcon {
          0%   { fill: transparent; stroke-dashoffset: 200; }
          70%  { fill: transparent; stroke-dashoffset: 0; }
          100% { fill: #fff; stroke-dashoffset: 0; }
        }
        /* Instagram: akhir fill gradien */
        @keyframes strokeIconIG {
          0%   { fill: transparent; stroke-dashoffset: 200; }
          70%  { fill: transparent; stroke-dashoffset: 0; }
          100% { fill: url(#igFill); stroke-dashoffset: 0; }
        }
        /* Gmail: tetap garis berwarna, tidak mengisi bidang */
        @keyframes strokeIconColor {
          0%   { fill: transparent; stroke-dashoffset: 200; }
          70%  { fill: transparent; stroke-dashoffset: 0; }
          100% { fill: transparent; stroke-dashoffset: 0; }
        }

        /* Loader lingkaran */
        .loader {
          position: absolute;
          bottom: 3cm;
          width: 70px;
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-weight: bold;
          font-size: 14px;
        }
        .loader::before {
          content: "";
          position: absolute;
          width: 70px;
          height: 70px;
          border: 4px solid transparent;
          border-top-color: #35e0ff;
          border-radius: 50%;
          animation: spin 1.2s linear infinite;
        }
        .loader::after {
          content: "";
          position: absolute;
          width: 50px;
          height: 50px;
          border: 4px solid transparent;
          border-bottom-color: #7c4dff;
          border-radius: 50%;
          animation: spinReverse 1.5s linear infinite;
        }
        .percent { z-index: 2; }
        @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        @keyframes spinReverse { from { transform: rotate(0); } to { transform: rotate(-360deg); } }
      `}</style>
    </main>
  );
}
