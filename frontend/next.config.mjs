/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output is enabled in Linux/Docker CI builds for minimal image size,
  // but kept disabled in local Windows development to prevent sandbox EPERM symlink locks.
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" } : {}),
  reactStrictMode: true,
};

export default nextConfig;
