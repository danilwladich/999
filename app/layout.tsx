import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "999 | marketplace",
	description: "the best marketplace",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={font.className}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<AuthProvider>
						<div className="container">{children}</div>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
