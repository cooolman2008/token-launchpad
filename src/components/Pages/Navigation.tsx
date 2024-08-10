"use client";

import { useEffect, useState, useRef } from "react";
import Select from "react-select";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/safu.svg";
import Links from "@/components/Modules/Navigation/Links";
import Search from "@/components/Modules/Navigation/Search";
import { animate, spring } from "motion";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

interface option {
	value: number;
	label: string;
}

function Navigation() {
	const [isClient, setIsClient] = useState(false);
	const { address } = useAccount();
	const wrapperRef = useRef<HTMLDivElement>(null);
	const { open } = useWeb3Modal();
	const { chains, switchChain } = useSwitchChain();
	const chainId = useChainId();
	const [chainOptions, setChainOptions] = useState<option[]>();

	useEffect(() => {
		const list: option[] = [];
		chains.map((chain) =>
			list.push({
				value: chain.id,
				label: chain.name,
			})
		);
		setChainOptions(list);
	}, [chains]);

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
				<nav className="w-full flex px-4 lg:px-8 py-5 h-20">
					<Link href={"/"} className="pr-8" scroll={true}>
						<Image id="box" src={logo} className="w-auto h-10" alt="SAFU Launcher Logo" />
					</Link>
					{address ? (
						<div className="ml-auto lg:hidden">
							<w3m-button />
						</div>
					) : (
						<>
							<div className="flex flex-col justify-center ml-auto lg:hidden">
								<button className="safu-soft-button" onClick={() => open()}>
									Connect Wallet
								</button>
							</div>
						</>
					)}
					<div
						className="menu-button w-10 h-10 rounded-full flex flex-col items-center justify-center lg:hidden ml-2"
						onClick={() => {
							animate("#menu", { x: [-288] }, { easing: spring({ stiffness: 300, damping: 16, mass: 0.4 }) });
							document.addEventListener("mouseup", handleClickOutside);
							document.addEventListener("touchend", handleClickOutside);
						}}
					>
						<div></div>
						<div></div>
						<div></div>
					</div>
					<div id="menu" className="menu" ref={wrapperRef}>
						<div className="flex flex-col p-8">
							<Search />
							<div className="flex flex-col">
								<Links />
							</div>

							{!address && (
								<div className="mt-4 flex flex-col items-center">
									{chainOptions && (
										<Select
											unstyled={true}
											defaultValue={chainOptions[1]}
											inputId="type"
											classNames={{
												control: (state) => "bg-neutral-900 p-2 rounded-full 2xl:text-sm",
												menuList: (state) => "bg-neutral-900 mt-1 rounded-xl 2xl:text-sm",
												option: (state) => " flex flex-col justify-center px-4 py-2 cursor-pointer",
											}}
											options={chainOptions}
											isSearchable={false}
											onChange={(value) => {
												if (value) switchChain({ chainId: value.value });
											}}
										/>
									)}
								</div>
							)}
						</div>
					</div>
					<div className="hidden lg:flex w-full">
						<Links />
						<Search />
						{address ? (
							<div>
								<w3m-button />
							</div>
						) : (
							<>
								<div className="flex flex-col justify-center mr-8">
									<button className="safu-soft-button" onClick={() => open()}>
										Connect Wallet
									</button>
								</div>

								{chainOptions && (
									<Select
										unstyled={true}
										defaultValue={chainOptions[1]}
										inputId="type"
										classNames={{
											control: (state) => "bg-neutral-900 p-2 rounded-full 2xl:text-sm",
											menuList: (state) => "bg-neutral-900 mt-1 rounded-xl 2xl:text-sm",
											option: (state) => " flex flex-col justify-center px-4 py-2 cursor-pointer",
										}}
										options={chainOptions}
										isSearchable={false}
										onChange={(value) => {
											if (value) switchChain({ chainId: value.value });
										}}
									/>
								)}
							</>
						)}
					</div>
				</nav>
			)}
		</>
	);
}
export default Navigation;
