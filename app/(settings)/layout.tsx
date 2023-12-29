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

			<main className="container pt-2 pb-12 sm:pt-12 sm:pb-2">{children}</main>

			<Footer />
		</>
	);
}
