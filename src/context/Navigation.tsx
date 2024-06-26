"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/safu.svg";
import Links from "@/components/PageModules/Navigation/Links";
import Search from "@/components/PageModules/Navigation/Search";
import { animate, spring } from "motion";

function Navigation() {
	const [isClient, setIsClient] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const handleClickOutside = (event: MouseEvent | TouchEvent) => {
		const wrapper = wrapperRef.current;
		if (wrapper instanceof HTMLElement && !wrapper.contains(event.target as Node)) {
			animate("#menu", { x: [0] }, { easing: spring({ stiffness: 300, damping: 16, mass: 0.4 }) });
			document.removeEventListener("mouseup", handleClickOutside);
			document.removeEventListener("touchend", handleClickOutside);
		}
	};

	return (
		<>
			{isClient && (
				<nav className="w-full flex px-8 py-5 h-20">
					<Link href={"/"} className="pr-8" scroll={true}>
						<Image id="box" src={logo} className="w-auto h-10" alt="SAFU Launcher Logo" />
					</Link>
					<div
						className="menu-button w-10 h-10 rounded-full flex flex-col items-center justify-center ml-auto lg:hidden"
						onClick={() => {
							animate("#menu", { x: [-320] }, { easing: spring({ stiffness: 300, damping: 16, mass: 0.4 }) });
							document.addEventListener("mouseup", handleClickOutside);
							document.addEventListener("touchend", handleClickOutside);
						}}
					>
						<div></div>
						<div></div>
						<div></div>
					</div>
					<div id="menu" className="menu" ref={wrapperRef}>
						<div className="flex flex-col">
							<Search />
							<div className="flex flex-col mb-8">
								<Links />
							</div>
							<div className="flex justify-center">
								<w3m-button />
							</div>
						</div>
					</div>
					<div className="hidden lg:flex w-full">
						<Links />
						<Search />
						<div>
							<w3m-button />
						</div>
					</div>
				</nav>
			)}
		</>
	);
}
export default Navigation;
