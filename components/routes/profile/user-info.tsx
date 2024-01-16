"use client";

import { useUserImageSrc } from "@/hooks/use-user-image-src";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function UserInfo({
	username,
	imageUrl,
}: {
	username: string;
	imageUrl: string;
}) {
	return (
		<div className="w-full flex flex-row gap-2 md:gap-4 items-center overflow-hidden">
			<Avatar className="w-20 md:w-24 h-20 md:h-24">
				<AvatarImage src={useUserImageSrc(imageUrl)} alt={username} />
				<AvatarFallback>{username[0]}</AvatarFallback>
			</Avatar>

			<h2 className="text-xl font-semibold truncate">{username}</h2>
		</div>
	);
}
