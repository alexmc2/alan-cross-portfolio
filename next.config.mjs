/** @type {import('next').NextConfig} */

const nextConfig = {
  // Ensure SSR + proper hydration for styled-components v6 used by @sanity/ui (Studio)
  // This mirrors the working project's configuration and is required in production.
  compiler: {
    styledComponents: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-vercel-skip-toolbar',
            value: '1',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
