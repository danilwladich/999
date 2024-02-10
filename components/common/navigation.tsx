"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/hooks/use-auth-store";
import { cn } from "@/lib/utils";

import { Home, Mail, User, Settings, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ILink {
	path: string;
	name: string;
	icon: JSX.Element;
	isActive: boolean;
	authProtected?: boolean;
}

export function Navigation() {
	const pathname = usePathname();

	const { user: authUser } = useAuthStore();

	const links: ILink[] = [
		{
			path: "/",
			name: "Home",
			icon: <Home className="w-4 h-4" />,
			isActive: pathname === "/",
		},
		{
			path: "/chat",
			name: "Chat",
			icon: <Mail className="w-4 h-4" />,
			isActive: pathname === "/chat",
			authProtected: !authUser,
		},
		{
			path: "/adding",
			name: "Adding",
			icon: <PlusCircle className="w-4 h-4" />,
			isActive: pathname === "/adding",
			authProtected: !authUser,
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
	authProtected,
}: ILink & { isLastElement: boolean }) {
	return (
		<Link
			href={authProtected ? `/auth?from=${path}` : path}
			className="flex items-center justify-between flex-1 group"
		>
			<div />

			<Button
				variant="link"
				className={cn("gap-2", authProtected && "opacity-50")}
			>
				{icon}

				<span className="sr-only md:not-sr-only md:whitespace-nowrap md:relative">
					{name}

					{!authProtected && (
						<div
							className="absolute bottom-0 left-0 w-full h-[1px] bg-current
							transition-opacity opacity-0 group-hover:opacity-100"
						/>
					)}
				</span>
			</Button>

			{!isLastElement ? (
				<Separator orientation="vertical" className="h-2/3" />
			) : (
				<div />
			)}
		</Link>
	);
}
