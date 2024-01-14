"use client";

import Link from "next/link";
import { useModalStore } from "@/hooks/use-modal-store";
import { useUserImageSrc } from "@/hooks/use-user-image-src";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function UserInfo({
	username,
	imageUrl,
}: {
	username: string;
	imageUrl: string;
}) {
	const { onClose } = useModalStore();

	return (
		<Link
			onClick={onClose}
			href={`/profile/${username}`}
			className="flex gap-2 items-center flex-1"
		>
			<Avatar className="w-10 h-10">
				<AvatarImage
					src={useUserImageSrc(imageUrl)}
					alt={`Avatar ${username}`}
				/>
				<AvatarFallback>{username[0]}</AvatarFallback>
			</Avatar>

			<p className="text-sm font-semibold">{username}</p>
		</Link>
	);
}
