/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                pathname: "/crisp-website-485112_cloudbuild/**",
            },
        ],
    },
};
export default nextConfig;
