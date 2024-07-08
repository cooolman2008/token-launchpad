"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function Links() {
	return (
		<>
			<Link href={"/"} className="self-center max-lg:mb-4 lg:pr-8" scroll={true}>
				<span className="">Explore</span>
			</Link>
			<Link href={"/launch"} className="self-center safu-soft-button" scroll={true}>
				<span className="">Launch</span>
			</Link>
		</>
	);
}
export default Links;
