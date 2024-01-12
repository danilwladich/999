"use client";

import { useAuthMe } from "@/hooks/use-auth-me";
import { useModalStore } from "@/hooks/use-modal-store";
import ShareButton from "./share-button";
import { useRouter } from "next/navigation";
import type { Follow } from "@prisma/client";
import FollowButton from "./follow-button";
import LogOutButton from "./log-out-button";

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
import { MoreHorizontal, MessageCircle, Pencil } from "lucide-react";

export default function UserActions({
	id,
	username,
	followers,
}: {
	id: string;
	username: string;
	followers: Follow[];
}) {
	const { user: authUser } = useAuthMe();
	const { onOpen } = useModalStore();
	const router = useRouter();

	const isOwner = id === authUser?.id;

	const isFollowing = followers.some((f) => f.whoFollowId === authUser?.id);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<MoreHorizontal className="w-6 h-6" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>
					{isOwner ? "My account" : username}
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<ShareButton username={username} />

					{!isOwner && (
						<>
							<DropdownMenuItem
								onClick={() => router.push(`/messages/${username}`)}
							>
								<MessageCircle className="mr-2 h-4 w-4" />
								<span>Write message</span>
							</DropdownMenuItem>

							<FollowButton
								isFollowing={isFollowing}
								id={id}
								username={username}
							/>
						</>
					)}
				</DropdownMenuGroup>

				{isOwner && (
					<>
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={() => onOpen("edit profile")}>
								<Pencil className="mr-2 h-4 w-4" />
								<span>Edit</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<LogOutButton />
						</DropdownMenuGroup>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
