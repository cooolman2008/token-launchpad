import type { ComponentProps, LegacyRef } from "react";
import { forwardRef } from "react";

interface TextFieldProps extends ComponentProps<"input"> {
	label: string;
	id: string;
	isPercent?: boolean;
	isError: boolean;
	error: string;
}

const TextField = forwardRef(
	({ label, id, isPercent, isError, error, ...rest }: TextFieldProps, ref: LegacyRef<HTMLInputElement>) => {
		return (
			<>
				<label htmlFor={id} className="block text-sm font-medium leading-6 text-white">
					{label}
				</label>
				<div className="mt-2 relative">
					<input
						id={id}
						ref={ref}
						className={
							"block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
							(isError
								? "border border-pink-600"
								: "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
						}
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
				{isError && <p className="mt-2 text-pink-600 text-sm">{error}</p>}
			</>
		);
	}
);
TextField.displayName = "text field";

export default TextField;
