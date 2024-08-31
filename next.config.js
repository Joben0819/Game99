/** @type {import('next').NextConfig} */
const path = require('path');
const { version } = require('./package.json');

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    APP_VERSION: version,
    GUARDIAN_APP_ID: 'YD00703002222399',
    SITE: process.env.SITE,
    SITE_TITLE: process.env.SITE_TITLE,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    additionalData: `@import "./styles/_helpers.scss", "./styles/_responsive.scss", "@/styles/_fonts.scss";`,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      //test-server
      {
        source: '/api-adjust/:path*',
        destination: 'https://api.adjust.com/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|ttf|js|css|wav|mp3|woff2|svga)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2629056, must-revalidate',
          },
        ],
      },
      {
        source: '/cache-storage-sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  generateBuildId: async () => {
    const buildId = version;
    return buildId;
  },
  webpack: (config, { dev }) => {
    const newConfig = config;
    if (!dev && newConfig.output.filename.startsWith('static')) {
      newConfig.output.filename = newConfig.output.filename.replace('[name]', `[name]-${version}`);
      newConfig.output.chunkFilename = newConfig.output.chunkFilename.replace('[name]', `[name]-${version}`);
    }
    return config;
  },
  // handler: async (req, res, next) => {
  //   try {
  //     await next();
  //   } catch (error) {
  //     // Handle the error here
  //     window.location.reload();
  //   }
  // },
  // experimental: {
  //   missingSuspenseWithCSRBailout: false,
  // },
};

module.exports = nextConfig;
