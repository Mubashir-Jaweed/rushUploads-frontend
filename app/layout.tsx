import type { Metadata } from "next";

import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "@/contexts/user";

import "./globals.css";
import Script from "next/script";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Rush Uploads",
	description: "From sharing large files with friends to delivering professional client work",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>

			</head>
			<Script
  id="adsense-init"
  strategy="afterInteractive"
			 async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.PUBLIC_GOOGLE_ADSENCE_CLIENT_ID}`}
     crossOrigin="anonymous"></Script>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<UserProvider>{children}</UserProvider>
				<ToastContainer />
				
			</body>
		</html>
	);
}
