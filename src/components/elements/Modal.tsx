import { useEffect, useState } from "react";

const Modal = ({
	msg,
	des,
	error,
	callback,
}: {
	msg: string;
	des?: string;
	error?: boolean;
	callback?: () => void;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setIsOpen(true);
	}, []);
	return (
		<>
			{isOpen && (
				<div className="fixed top-0 left-0 z-50 flex justify-center items-center h-screen w-screen bg-[rgba(0,0,0,0.75)]">
					<div
						className={
							"relative flex flex-col py-8 md:py-12 xl:py-16 2xl:py-20 px-8 md:px-24 xl:px-48 2xl:px-64 bg-gradient-to-tr backdrop-blur-sm rounded-xl items-center justify-center font-light border" +
							(error ? " border-red-400/25 from-red-500/15" : " border-emerald-400/25 from-green-500/15")
						}
					>
						<span
							className={"text-base xl:text-lg 2xl:text-xl font-light " + (error ? "text-slate-200" : "text-slate-200")}
						>
							{msg}
						</span>
						{des && (
							<span
								className={
									"text-sm xl:text-base 2xl:text-lg text-center font-normal " +
									(error ? "text-red-700" : "text-green-600")
								}
							>
								{des}
							</span>
						)}
						<svg
							width={20}
							height={20}
							viewBox="0 0 72 72"
							className="absolute right-0 top-0 mr-2 mt-2 font-bold cursor-pointer fill-slate-200"
							onClick={() => {
								if (callback) {
									callback();
								}
								setIsOpen(false);
							}}
						>
							<path d="M 19 15 C 17.977 15 16.951875 15.390875 16.171875 16.171875 C 14.609875 17.733875 14.609875 20.266125 16.171875 21.828125 L 30.34375 36 L 16.171875 50.171875 C 14.609875 51.733875 14.609875 54.266125 16.171875 55.828125 C 16.951875 56.608125 17.977 57 19 57 C 20.023 57 21.048125 56.609125 21.828125 55.828125 L 36 41.65625 L 50.171875 55.828125 C 51.731875 57.390125 54.267125 57.390125 55.828125 55.828125 C 57.391125 54.265125 57.391125 51.734875 55.828125 50.171875 L 41.65625 36 L 55.828125 21.828125 C 57.390125 20.266125 57.390125 17.733875 55.828125 16.171875 C 54.268125 14.610875 51.731875 14.609875 50.171875 16.171875 L 36 30.34375 L 21.828125 16.171875 C 21.048125 15.391875 20.023 15 19 15 z"></path>
						</svg>
					</div>
				</div>
			)}
		</>
	);
};

export default Modal;
