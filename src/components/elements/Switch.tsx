import type { ComponentProps } from "react";

const Switch = ({ ...props }: ComponentProps<"input">) => {
	return (
		<label className="switch mr-4">
			<input type="checkbox" {...props} />
			<span className="slider round"></span>
		</label>
	);
};

export default Switch;
