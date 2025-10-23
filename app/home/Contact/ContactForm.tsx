"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Sosmed from "../../home/Contact/SosmedBox";
import StarBorder from "../../components/Effects/StarBorder";

type ContactFormProps = {
  isLightMode?: boolean;
  className?: string;
  align?: "left" | "center";
};

const Field =
  "w-full px-4 py-2 rounded-lg border-2 border-neutral-300 dark:border-white/40 " +
  "bg-white/60 dark:bg-white/10 backdrop-blur-md " +
  "focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-500 " +
  "placeholder-black/50 dark:placeholder-white/60 text-black dark:text-white";

const variants = {
  hidden: { x: "22vw", opacity: 0 },      // start off-screen kanan
  center: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 18, mass: 0.8 },
  },
  exitRight: { x: "26vw", opacity: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function ContactForm({
  isLightMode,
  className,
  align = "left",
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    setErr(null);
    // Simulasi
    setOk(false);
    setErr("Gagal mengirim. Coba lagi ya.");
    setLoading(false);
  }

  const dockClass =
    align === "left"
      ? "justify-self-start self-start place-self-start"
      : "mx-auto";

  // === Animasi in-view + arah scroll ===
  const ref = useRef<HTMLFormElement | null>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const controls = useAnimation();

  const [lastY, setLastY] = useState(0);
  const [scrollUp, setScrollUp] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrollUp(y < lastY);
      setLastY(y);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  useEffect(() => {
    if (inView) {
      // Saat elemen terlihat → animasi ke posisi center
      controls.start("center");
    } else {
      if (scrollUp) {
        // scroll ke atas → geser ke kanan & hilang
        controls.start("exitRight");
      } else {
        // scroll ke bawah (melewati section) → reset ke hidden kanan
        controls.start("hidden");
      }
    }
  }, [inView, scrollUp, controls]);

  return (
    <motion.form
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={controls}
      onSubmit={onSubmit}
      className={[
        "w-full max-w-[94vw] h-auto",               // mobile
        "md:w-[13cm] lg:w-[15cm] md:max-w-[450px]", // desktop lebar form
        "md:ml-[11cm]",                              // posisi sesuai setelanmu
        dockClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <StarBorder
        as="div"
        className="block w-full rounded-[20px]"
        color="rgba(168,85,247,0.9)"
        speed="6s"
        thickness={2}
      >
        <div className="rounded-[20px] pt-2 sm:pt-3 pb-4 sm:pb-5">
          <h3 className="pl-2 sm:pl-3 text-white font-extrabold text-xl sm:text-2xl leading-none text-left">
            Hubungi Saya
          </h3>
          <p className="pl-2 sm:pl-3 mt-1 text-xs sm:text-sm text-white/90 text-left">
            Ada yang ingin didiskusikan? Kirim pesan ke saya!
          </p>

          <div className="mt-4 px-3 sm:px-4">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={Field}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={Field}
                required
              />
              <textarea
                placeholder="Pesan"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${Field} h-32 resize-y`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full inline-flex items-center justify-center rounded-lg px-4 py-3 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Mengirim..." : "Kirim"}
            </button>

            <div className="mt-2 space-y-1 text-center">
              {ok && (
                <p className="text-green-400 text-sm">
                  Pesan terkirim. Terima kasih!
                </p>
              )}
              {ok === false && (
                <>
                  <p className="text-red-400 text-sm">
                    Gagal mengirim. Coba lagi ya.
                  </p>
                  {err && <p className="text-red-300 text-xs">{err}</p>}
                </>
              )}
            </div>
          </div>
        </div>
      </StarBorder>
    </motion.form>
  );
}

export default function ContactSection() {
  return (
    <section id="contact" className="w-full">
      {/* Grid dua kolom: kiri Sosmed (masuk dari kiri), kanan ContactForm (masuk dari kanan) */}
      <div
        className="
          grid gap-6
          grid-cols-1
          md:auto-cols-max md:grid-flow-col
        "
      >
        <Sosmed align="left" />
        <ContactForm align="left" />
      </div>
    </section>
  );
}
