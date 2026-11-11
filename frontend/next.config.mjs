/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for containerized deployments; static HTML export for Azure Static Web Apps (Free tier)
  output: process.env.DOCKER_BUILD === "1" ? "standalone" : "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
