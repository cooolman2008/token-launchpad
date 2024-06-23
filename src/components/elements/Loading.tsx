const Loading = ({ msg }: { msg: string }) => {
	return (
		<div className="fixed top-0 left-0 z-50 flex justify-center items-center h-screen w-screen bg-[rgba(0,0,0,0.75)]">
			<div className="flex flex-col items-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="120" height="60" viewBox="0 0 300 150">
					<defs>
						<linearGradient id="grad">
							<stop offset="0%" stopColor="rgb(219, 39, 119)" />
							<stop offset="100%" stopColor="rgb(39, 99, 235)" />
						</linearGradient>
					</defs>
					<path
						fill="none"
						stroke="url(#grad)"
						strokeWidth="18"
						strokeLinecap="round"
						strokeDasharray="300 385"
						strokeDashoffset="0"
						d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
					>
						<animate
							attributeName="stroke-dashoffset"
							calcMode="spline"
							dur="2"
							values="685;-685"
							keySplines="0 0 1 1"
							repeatCount="indefinite"
						></animate>
					</path>
				</svg>
				<p className="text-base mt-8">{msg}</p>
			</div>
		</div>
	);
};

export default Loading;
