"use client";

import { MoreHorizontal, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import FollowButton from "@/components/common/buttons/follow-button";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserActions({
	id,
	username,
	isFollowing,
}: {
	id: string;
	username: string;
	isFollowing: boolean;
}) {
	const router = useRouter();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<MoreHorizontal className="w-6 h-6" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>{username}</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => router.push(`/messages/${username}`)}
					>
						<MessageCircle className="mr-2 h-4 w-4" />
						<span>Write message</span>
					</DropdownMenuItem>

					<FollowButton isFollowing={isFollowing} id={id} username={username} />
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
