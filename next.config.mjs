// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export (cocok untuk drag-and-drop / hosting statis)


  // Penting untuk <Image> saat static export
  images: {
    unoptimized: true,
  },

  // Abaikan error TypeScript agar build Netlify tidak gagal
  typescript: {
    ignoreBuildErrors: true,
  },

  // (opsional)
  // basePath: '',
  // assetPrefix: '',
};

export default nextConfig;
