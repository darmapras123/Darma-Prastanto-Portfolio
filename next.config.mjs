/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pakai static export agar bisa drag-and-drop ke Netlify
  output: 'export',

  // Penting untuk Next <Image> saat export
  images: {
    unoptimized: true,
  },

  // (Opsional) kalau pakai App Router dan ada asset yang butuh basePath, isi di sini
  // basePath: '',
  // assetPrefix: '',
};

export default nextConfig;
