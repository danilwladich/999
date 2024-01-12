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

			<main className="pt-2 md:pt-16 pb-16 md:pb-2 px-2 md:container">
				{children}
			</main>

			<Footer />
		</>
	);
}
