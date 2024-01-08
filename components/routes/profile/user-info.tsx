"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "next-themes";

export default function UserInfo({
	username,
	imageUrl,
}: {
	username: string;
	imageUrl: string;
}) {
	const { resolvedTheme } = useTheme();

	const imageSrc =
		imageUrl || resolvedTheme === "dark"
			? "/images/common/user-dark.jpg"
			: "/images/common/user-light.jpg";

	return (
		<div className="flex flex-col md:flex-row gap-4 items-center">
			<Avatar className="w-20 md:w-24 h-20 md:h-24">
				<AvatarImage src={imageSrc} alt={`Avatar ${username}`} />
				<AvatarFallback>{username[0]}</AvatarFallback>
			</Avatar>

			<h2 className="text-xl font-semibold">{username}</h2>
		</div>
	);
}
