import type { ComponentProps, LegacyRef } from "react";
import { forwardRef } from "react";

interface TextFieldProps extends ComponentProps<"input"> {
	label: string;
	id: string;
	disabled?: boolean;
	isPercent?: boolean;
	isError: boolean;
	error: string;
	containerWidth?: string;
	width: string;
	labelWidth?: string;
	padding?: string;
	margin?: string;
}

const TextField = forwardRef(
	(
		{
			label,
			id,
			disabled = false,
			isPercent,
			isError,
			error,
			containerWidth,
			width,
			labelWidth = "",
			padding,
			margin,
			...rest
		}: TextFieldProps,
		ref: LegacyRef<HTMLInputElement>
	) => {
		return (
			<>
				<div
					className={
						"flex items-center flex-wrap " +
						(containerWidth ? containerWidth : " w-full md:w-1/2 2xl:w-1/3 ") +
						(padding ? padding : " md:pr-4 2xl:pr-12 ") +
						(margin ? margin : " mb-4 ")
					}
				>
					<label htmlFor={id} className={"text-xl text-gray-400 pr-4 " + labelWidth}>
						{label}
					</label>
					<div className={"relative " + width}>
						<input
							id={id}
							ref={ref}
							className={
								"block w-full rounded-xl ps-3 pe-3 py-1.5 shadow-sm placeholder:text-gray-400 bg-neutral-900 outline-0 2xl:text-sm " +
								(disabled
									? "text-gray-400"
									: "text-white " + (isError ? "border-x border-pink-500" : "border-l border-gray-600"))
							}
							disabled={disabled}
							{...rest}
						/>
						{(isError || isPercent) && (
							<div className="absolute inset-y-0 right-0 flex items-center pr-4">
								{isPercent ? (
									"%"
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
										className="h-5 w-5 text-pink-600"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
											clipRule="evenodd"
										></path>
									</svg>
								)}
							</div>
						)}
					</div>
					{isError && <p className="w-full mt-2 text-pink-600 text-sm text-right">{error}</p>}
				</div>
			</>
		);
	}
);
TextField.displayName = "text field";

export default TextField;
