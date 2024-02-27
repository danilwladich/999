"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { UserPlus, UserMinus } from "lucide-react";

export default function FollowButton({
	isFollowing,
	id,
	username,
}: {
	isFollowing: boolean;
	id: string;
	username: string;
}) {
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	async function onFollow(
		e: React.MouseEvent<HTMLDivElement>,
		isFollowing: boolean
	) {
		e.preventDefault();

		setIsLoading(true);

		try {
			if (isFollowing) {
				// Making a DELETE request to the follow API endpoint
				await axios.delete("/api/user/follow", { data: { userId: id } });
			} else {
				// Making a POST request to the follow API endpoint
				await axios.post("/api/user/follow", { userId: id });
			}

			// Refresh page to get new followers data
			router.refresh();
		} catch (e: unknown) {
			// Handling AxiosError
			const error = e as AxiosError;

			// Extracting response from AxiosError
			const res = error?.response as AxiosResponse<string, any>;

			// Handling non-response errors
			if (!res) {
				toast.error("Follow user error", { description: error.message });
				return;
			}

			if (res.status === 401) {
				router.push(`/auth?from=/profile/${username}`);
			}
		}

		setIsLoading(false);
	}

	return (
		<DropdownMenuItem
			disabled={isLoading}
			onClick={(e) => onFollow(e, isFollowing)}
		>
			{isFollowing ? (
				<UserMinus className="mr-2 h-4 w-4" />
			) : (
				<UserPlus className="mr-2 h-4 w-4" />
			)}

			<span>{isFollowing ? "Unfollow" : "Follow"}</span>
		</DropdownMenuItem>
	);
}
