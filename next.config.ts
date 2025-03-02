import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	async headers() {
		return [
			{
			  source: '/(.*)',
			  headers: [
				{
				  key: 'Content-Security-Policy',
				  value: `script-src 'self' ${process.env.NEXT_PUBLIC_AD_SCRIPT_URL}`,
				},
			  ],
			},
		  ];
	},
};

export default nextConfig;
