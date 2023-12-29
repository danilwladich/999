import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "999 | auth",
	description:
		"Login to your existing account or create free account now and join our community",
};

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <main className="container">{children}</main>;
}
