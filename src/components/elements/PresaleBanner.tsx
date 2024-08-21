"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function PresaleBanner() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<>
			{isClient && (
				<div className="w-full flex justify-center text-center py-6 md:py-8 bg-[#000000] border-t border-neutral-800 z-30 fixed bottom-0">
					<div className="container flex max-md:flex-col justify-center">
						<p className="text-3xl md:text-4xl text-slate-200 font-normal italic max-md:mb-4">
							<b className="text-3xl md:text-4xl font-black mr-2">SAFU PRESALE</b> is on!
						</p>
						<div className="md:ml-12 px-8 flex flex-col justify-center">
							<Link href="/0xdca7905c38f15d5e653f76e956109bf5a4f43fbb" className="safu-button-secondary" scroll={true}>
								Buy Presale
							</Link>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
export default PresaleBanner;
