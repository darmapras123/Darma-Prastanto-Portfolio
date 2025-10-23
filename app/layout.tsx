// app/layout.tsx
import "./globals.css";
import "./components/ProfileCard/ProfileCard.css";
import type { Metadata, Viewport } from "next";
import StarsGlobal from "./components/Stars/StarsGlobal"; // ⬅️ tambahkan ini

export const metadata: Metadata = {
  title: "Darma Prastanto",
  icons: {
    icon: [{ url: "/logolight1.png", type: "image/png" }],
    apple: [{ url: "/logolight1.png", sizes: "180x180" }],
    shortcut: ["/logolight1.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#151515" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* ... head lain kamu */}
      </head>
      <body>
        {/* ⬇️ Layer bintang global (muncul otomatis saat dark mode) */}
        <StarsGlobal />

        {/* Konten halaman */}
        {children}
      </body>
    </html>
  );
}
