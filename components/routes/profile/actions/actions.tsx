"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { useAuthMe } from "@/hooks/use-auth-me";
import { LogOut, MoreHorizontal, MessageCircle } from "lucide-react";
import ShareButton from "./share-button";
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
}: {
	id: string;
	username: string;
	followers: Follow[];
}) {
	const { user: authUser } = useAuthMe();

	const router = useRouter();

	const isOwner = id === authUser?.id;

	const isFollowing = followers.some((f) => f.whoFollowId === authUser?.id);

	async function onLogOut() {
		try {
			await axios.delete("/api/auth/me");

			router.push("/auth");
		} catch (e: unknown) {
			// Handling AxiosError
			const error = e as AxiosError;

			// Extracting response from AxiosError
			const res = error?.response as AxiosResponse<string, any>;

			// Handling non-response errors
			if (!res) {
				alert(error.message);
				return;
			}
		}
	}

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
						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem onClick={onLogOut}>
								<LogOut className="mr-2 h-4 w-4" />
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
