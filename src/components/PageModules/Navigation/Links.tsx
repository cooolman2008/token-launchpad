"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function Links() {
	return (
		<>
			<Link href={"/"} className="self-center max-lg:mb-4 lg:pr-8">
				<span className="text-white">Explore</span>
			</Link>
			<Link href={"/"} className="self-center max-lg:mb-4 lg:pr-8">
				<span className="hover:text-white">Swap</span>
			</Link>
			<Link href={"/launch"} className="self-center safu-soft-button">
				<span className="safu-grad-text">Launch</span>
			</Link>
		</>
	);
}
export default Links;
