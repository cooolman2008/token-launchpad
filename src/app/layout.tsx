import "./globals.css";

import type { Metadata } from "next";

import Web3ModalProvider from "@/context";

import Navigation from "@/components/Pages/Navigation";

import { Plus_Jakarta_Sans } from "next/font/google";
const plus_Jakarta_Sans = Plus_Jakarta_Sans({ subsets: ["latin"] });

import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
	title: "SAFU Launcher",
	description: "Fully on chain erc20 token launcher",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body id="body" className={plus_Jakarta_Sans.className + " pb-4 overflow-x-hidden relative pb-40 md:pb-32"}>
				<div className="absolute right-0 left-0 top-0 bottom-0 z-0 bg-[url('/noise.png')] opacity-[0.015]"></div>
				<Web3ModalProvider>
					<main className="mx-auto flex min-h-screen flex-col items-center z-10 relative">
						<Navigation />
						<div className="container mx-auto flex flex-col items-center px-6 lg:px-24">{children}</div>
					</main>
				</Web3ModalProvider>
			</body>
			<GoogleAnalytics gaId="G-MVTHDGRPLN" />
		</html>
	);
}
