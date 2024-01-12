"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useModalStore } from "@/hooks/use-modal-store";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function UserInfo({
	username,
	imageUrl,
}: {
	username: string;
	imageUrl: string;
}) {
	const { onClose } = useModalStore();

	const { resolvedTheme } = useTheme();

	const imageSrc =
		imageUrl || resolvedTheme === "dark"
			? "/images/common/user-dark.jpg"
			: "/images/common/user-light.jpg";

	return (
		<Link
			onClick={onClose}
			href={`/profile/${username}`}
			className="flex gap-2 items-center flex-1"
		>
			<Avatar className="">
				<AvatarImage src={imageSrc} alt={`Avatar ${username}`} />
				<AvatarFallback>{username[0]}</AvatarFallback>
			</Avatar>

			<p className="text-sm font-semibold">{username}</p>
		</Link>
	);
}
