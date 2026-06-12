"use client";

import { useState } from "react";

type FormPesanLangsungProps = {
  isLightMode: boolean;
};

export default function FormPesanLangsung({ isLightMode }: FormPesanLangsungProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      // Menembak ke API contact internal Resend milik Anda
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Memeriksa respon ok berdasarkan struktur file API Resend Anda
      if (response.ok && data.ok) {
        setSubmitResult({
          success: true,
          message: "Pesan Anda berhasil dikirim! Terima kasih sudah menghubungi saya.",
        });
        (e.target as HTMLFormElement).reset(); // Mengosongkan form jika sukses
      } else {
        setSubmitResult({
          success: false,
          message: data.error || "Gagal mengirim pesan. Silakan cek konfigurasi.",
        });
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "Terjadi gangguan jaringan atau server sedang offline.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className={[
        "w-full max-w-[440px] p-6 sm:p-8 rounded-3xl border transition-all duration-300",
        isLightMode 
          ? "bg-white/80 border-black/10 shadow-lg shadow-black/5" 
          : "bg-[#1d1d1dfa] border-white/10 shadow-xl"
      ].join(" ")}
    >
      <h3 className="text-xl font-bold mb-4 text-left">Kirim Pesan Langsung</h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        <div>
          <label className="block text-xs font-semibold mb-1 opacity-80 uppercase tracking-wider">Nama Anda</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Nama Lengkap"
            className={[
              "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all",
              isLightMode
                ? "bg-gray-50 border-black/10 focus:border-blue-500 text-black"
                : "bg-[#121212] border-white/10 focus:border-cyan-400 text-white"
            ].join(" ")}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 opacity-80 uppercase tracking-wider">Email Anda</label>
          <input
            type="email"
            name="email"
            required
            placeholder="nama@gmail.com"
            className={[
              "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all",
              isLightMode
                ? "bg-gray-50 border-black/10 focus:border-blue-500 text-black"
                : "bg-[#121212] border-white/10 focus:border-cyan-400 text-white"
            ].join(" ")}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 opacity-80 uppercase tracking-wider">Pesan / Komentar</label>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Tulis pesan atau penawaran kerja sama di sini..."
            className={[
              "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-none",
              isLightMode
                ? "bg-gray-50 border-black/10 focus:border-blue-500 text-black"
                : "bg-[#121212] border-white/10 focus:border-cyan-400 text-white"
            ].join(" ")}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={[
            "w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 transform active:scale-[0.98]",
            isSubmitting ? "opacity-50 cursor-not-allowed" : "",
            isLightMode
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20"
              : "bg-gradient-to-r from-[#19D7FF] to-[#2BD985] hover:opacity-90 text-black shadow-lg shadow-cyan-500/10"
          ].join(" ")}
        >
          {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
        </button>

        {submitResult && (
          <div
            className={[
              "text-xs p-3 rounded-xl border mt-2 text-center font-medium",
              submitResult.success
                ? "bg-green-500/10 border-green-500/30 text-green-500"
                : "bg-red-500/10 border-red-500/30 text-red-500",
            ].join(" ")}
          >
            {submitResult.message}
          </div>
        )}
      </form>
    </div>
  );
}