import type { Metadata } from "next";

import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "@/contexts/user";

import "./globals.css";

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
			
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<UserProvider>{children}</UserProvider>
				<ToastContainer />
			</body>
		</html>
	);
}
