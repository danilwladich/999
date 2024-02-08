import Link from "next/link";
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
		<Link
			href={`/profile/${username}`}
			className="flex gap-2 items-center flex-1 overflow-hidden"
		>
			<Avatar className="w-12 h-12">
				<AvatarImage src={useUserImageSrc(imageUrl)} alt={username} />
				<AvatarFallback>{username[0]}</AvatarFallback>
			</Avatar>

			<p className="font-semibold truncate">{username}</p>
		</Link>
	);
}
