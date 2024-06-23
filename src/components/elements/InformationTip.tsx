import { useRef, useState } from "react";

const InformationTip = ({ msg }: { msg: string }) => {
	const [isOpen, setIsOpen] = useState(false);
	const handleClickOutside = (event: MouseEvent | TouchEvent) => {
		setIsOpen(false);
		document.removeEventListener("mouseup", handleClickOutside);
		document.removeEventListener("touchend", handleClickOutside);
	};

	const handleClick = () => {
		document.addEventListener("mouseup", handleClickOutside);
		document.addEventListener("touchend", handleClickOutside);
		setIsOpen(true);
	};

	return (
		<div className="relative">
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				className="fill-gray-500 hover:fill-gray-400 cursor-pointer ml-1"
				onClick={handleClick}
			>
				<path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12.02 17.5C11.468 17.5 11.0149 17.052 11.0149 16.5C11.0149 15.948 11.458 15.5 12.01 15.5H12.02C12.573 15.5 13.02 15.948 13.02 16.5C13.02 17.052 12.572 17.5 12.02 17.5ZM13.603 12.5281C12.872 13.0181 12.7359 13.291 12.7109 13.363C12.6059 13.676 12.314 13.874 12 13.874C11.921 13.874 11.841 13.862 11.762 13.835C11.369 13.703 11.1581 13.278 11.2891 12.885C11.4701 12.345 11.9391 11.836 12.7671 11.281C13.7881 10.597 13.657 9.84707 13.614 9.60107C13.501 8.94707 12.95 8.38988 12.303 8.27588C11.811 8.18588 11.3301 8.31488 10.9541 8.62988C10.5761 8.94688 10.3589 9.41391 10.3589 9.90991C10.3589 10.3239 10.0229 10.6599 9.60889 10.6599C9.19489 10.6599 8.85889 10.3239 8.85889 9.90991C8.85889 8.96891 9.27099 8.08396 9.98999 7.48096C10.702 6.88496 11.639 6.63605 12.564 6.80005C13.831 7.02405 14.8701 8.07097 15.0911 9.34497C15.3111 10.607 14.782 11.7381 13.603 12.5281Z"></path>
			</svg>
			<p
				className={
					"absolute bg-neutral-900 rounded-xl p-2 text-xs w-64 tooltip border border-neutral-700" +
					(isOpen ? " open" : "")
				}
			>
				{msg}
			</p>
		</div>
	);
};

export default InformationTip;
