"use client";

import { useModalStore } from "@/hooks/use-modal-store";
import { MoreHorizontal, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Follow } from "@prisma/client";

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
import { FollowButton } from "./follow-button";

export default function UserActions({
	id,
	username,
	followers,
	isFollowing,
	mutateOnFollow,
}: {
	id: string;
	username: string;
	followers: Follow[];
	isFollowing: boolean;
	mutateOnFollow: () => void;
}) {
	const { onClose } = useModalStore();

	const router = useRouter();

	function onWriteMessage() {
		onClose();
		router.push(`/messages/${username}`);
	}

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
					<DropdownMenuItem onClick={onWriteMessage}>
						<MessageCircle className="mr-2 h-4 w-4" />
						<span>Write message</span>
					</DropdownMenuItem>

					<FollowButton
						isFollowing={isFollowing}
						id={id}
						username={username}
						mutateOnFollow={mutateOnFollow}
					/>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
