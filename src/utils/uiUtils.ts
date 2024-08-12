export const scrollTo = (id: string) => {
	const ele = document.getElementById(id);
	if (ele) {
		ele.scrollIntoView({
			behavior: "smooth",
		});
	}
};
