"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Mail, User, Settings } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "@/components/providers/auth-provider";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const ICON_SIZE = 16;

interface ILink {
	path: string;
	name: string;
	icon: JSX.Element;
	isActive: boolean;
}

export function Navigation() {
	const pathname = usePathname();

	const authUser = useContext(AuthContext);

	const links: ILink[] = [
		{
			path: "/",
			name: "Home",
			icon: <Home size={ICON_SIZE} />,
			isActive: pathname === "/",
		},
		{
			path: "/messages",
			name: "Messages",
			icon: <Mail size={ICON_SIZE} />,
			isActive: pathname === "/messages",
		},
		{
			path: authUser ? "/profile" : "/auth",
			name: authUser ? "Profile" : "Sing in",
			icon: <User size={ICON_SIZE} />,
			isActive: pathname === "/profile",
		},
		{
			path: "/settings",
			name: "Settings",
			icon: <Settings size={ICON_SIZE} />,
			isActive: pathname === "/settings",
		},
	];

	return (
		<nav className="flex justify-between">
			{links.map((link, index) => (
				<NavLink
					key={link.name}
					{...link}
					isLastElement={index + 1 === links.length}
				/>
			))}
		</nav>
	);
}

function NavLink({
	path,
	name,
	icon,
	isActive,
	isLastElement,
}: ILink & { isLastElement: boolean }) {
	return (
		<Link
			href={path}
			key={name}
			className="flex items-center justify-between flex-1"
		>
			<div />

			<Button variant="link" className={`gap-2 ${isActive ? "underline" : ""}`}>
				{icon}

				<p className="sr-only md:not-sr-only md:whitespace-nowrap">{name}</p>
			</Button>

			{!isLastElement ? (
				<Separator orientation="vertical" className="h-2/3" />
			) : (
				<div />
			)}
		</Link>
	);
}
