"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Mail, User, Settings, PlusCircle } from "lucide-react";
import { useAuthMe } from "@/hooks/use-auth-me";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ILink {
	path: string;
	name: string;
	icon: JSX.Element;
	isActive: boolean;
}

export function Navigation() {
	const pathname = usePathname();

	const { user: authUser } = useAuthMe();

	const links: ILink[] = [
		{
			path: "/",
			name: "Home",
			icon: <Home className="w-4 h-4" />,
			isActive: pathname === "/",
		},
		{
			path: "/messages",
			name: "Messages",
			icon: <Mail className="w-4 h-4" />,
			isActive: pathname === "/messages",
		},
		{
			path: "/adding",
			name: "Adding",
			icon: <PlusCircle className="w-4 h-4" />,
			isActive: pathname === "/adding",
		},
		{
			path: authUser ? `/profile/${authUser.username}` : "/auth",
			name: authUser ? "Profile" : "Sing in",
			icon: <User className="w-4 h-4" />,
			isActive: pathname === `/profile/${authUser?.username}`,
		},
		{
			path: "/settings",
			name: "Settings",
			icon: <Settings className="w-4 h-4" />,
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
		<Link href={path} className="flex items-center justify-between flex-1">
			<div />

			<Button variant="link" className={cn("gap-2", isActive && "underline")}>
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
