import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Web3Modal from "../context/Web3Modal";
import "./globals.css";
import Navigation from "@/context/Navigation";
const plus_Jakarta_Sans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "SAFU Launcher",
	description: "Fully on chain erc20 token launcher",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={plus_Jakarta_Sans.className + " pb-4 overflow-x-hidden"}>
				<Navigation />
				<main className="container mx-auto flex min-h-screen flex-col items-center px-6 lg:px-24">
					<Web3Modal>{children}</Web3Modal>
				</main>
			</body>
		</html>
	);
}
