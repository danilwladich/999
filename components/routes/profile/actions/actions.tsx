"use client";

import { useAuthStore } from "@/hooks/use-auth-store";
import { useModalStore } from "@/hooks/use-modal-store";
import ShareButton from "@/components/common/buttons/share-button";
import { useRouter } from "next/navigation";
import FollowButton from "@/components/common/buttons/follow-button";
import LogOutButton from "@/components/common/buttons/log-out-button";
import { getAppTitle } from "@/lib/get-app-title";
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
import { MoreHorizontal, MessageCircle, Pencil, ImagePlus } from "lucide-react";

export default function UserActions({
	id,
	username,
	followers,
}: {
	id: string;
	username: string;
	followers: Follow[];
}) {
	const { user: authUser } = useAuthStore();
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
					<ShareButton
						url={`/profile/${username}`}
						text={getAppTitle(username)}
					/>

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
						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem onClick={() => onOpen("edit username")}>
								<Pencil className="mr-2 h-4 w-4" />
								<span>Edit username</span>
							</DropdownMenuItem>

							<DropdownMenuItem onClick={() => onOpen("edit avatar")}>
								<ImagePlus className="mr-2 h-4 w-4" />
								<span>Edit avatar</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem>
								<LogOutButton />
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
