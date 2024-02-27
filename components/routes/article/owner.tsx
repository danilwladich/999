"use client";

import { useUserImageSrc } from "@/hooks/use-user-image-src";
import Link from "next/link";
import type { User } from "@prisma/client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Owner({ username, imageUrl }: User) {
	return (
		<div className="w-full flex gap-2 md:gap-4 items-center overflow-hidden">
			<Avatar className="w-14 h-14">
				<AvatarImage src={useUserImageSrc(imageUrl)} alt={username} />
				<AvatarFallback>{username[0]}</AvatarFallback>
			</Avatar>

			<Link
				href={`/profile/${username}`}
				className="text-lg font-semibold truncate hover:underline"
			>
				{username}
			</Link>
		</div>
	);
}
