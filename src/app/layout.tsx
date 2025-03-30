import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "@/styles/globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Muzyard | Spotify widget for your README",
	description: "OwO? What's this?",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} antialiased p-12`}>
				{children}
			</body>
		</html>
	);
}
