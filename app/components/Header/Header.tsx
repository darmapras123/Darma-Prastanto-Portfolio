// app/components/Header.tsx
"use client";
import { useState } from "react";

export default function Header() {
  const [isLightMode, setIsLightMode] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
        isLightMode
          ? "bg-white text-black shadow-md"
          : "bg-gray-900 text-white"
      }`}
    >
      <nav className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo / Judul */}
        <h1 className="font-bold text-lg">Portofolio</h1>

        {/* Menu utama */}
        <ul className="flex gap-6">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">Tentang</a></li>
          <li><a href="#project">Project</a></li>
          <li><a href="#contact">Kontak</a></li>
        </ul>

        {/* Tombol toggle mode */}
        <button
          onClick={() => setIsLightMode(!isLightMode)}
          className="ml-6 px-3 py-1 border rounded-lg text-sm"
        >
          {isLightMode ? "Dark Mode" : "Light Mode"}
        </button>
      </nav>
    </header>
  );
}
