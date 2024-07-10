import "./globals.css";

import type { Metadata } from "next";
import { headers } from "next/headers";

import { cookieToInitialState } from "wagmi";
import { config } from "@/config";
import Web3ModalProvider from "@/context";

import Navigation from "@/components/Pages/Navigation";

import { Plus_Jakarta_Sans } from "next/font/google";
const plus_Jakarta_Sans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "SAFU Launcher",
	description: "Fully on chain erc20 token launcher",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const initialState = cookieToInitialState(config, headers().get("cookie"));
	return (
		<html lang="en">
			<body className={plus_Jakarta_Sans.className + " pb-4 overflow-x-hidden"}>
				<Web3ModalProvider initialState={initialState}>
					<main className="mx-auto flex min-h-screen flex-col items-center">
						<Navigation />
						<div className="container mx-auto flex flex-col items-center px-6 lg:px-24">{children}</div>
					</main>
				</Web3ModalProvider>
			</body>
		</html>
	);
}
