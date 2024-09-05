import TokenView from "@/components/Pages/TokenView";

export default function Token({ params }: { params: { slug: `0x${string}` } }) {
	return <TokenView params={{ slug: params.slug }} />;
}
