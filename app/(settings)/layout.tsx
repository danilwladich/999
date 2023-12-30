import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/header";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Header />

			<main className="container pt-2 pb-12 md:pt-12 md:pb-2">{children}</main>

			<Footer />
		</>
	);
}
