import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { AlertDialogProvider } from "@/components/providers/alert-dialog-provider";
import { Toaster } from "@/components/ui/sonner";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "999 | marketplace",
	description: "The best marketplace",
	authors: [
		{ name: "Daniel Władyczewski", url: "https://github.com/danilwladich" },
	],
	icons: [
		{
			rel: "icon",
			url: "/icon?<generated>",
			sizes: "32x32",
			type: "image/png",
		},
	],
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
						<ModalProvider />
						<AlertDialogProvider />
						{children}
						<Toaster />
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
