"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { useModalStore } from "@/hooks/use-modal-store";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function FollowButton({
	isFollowing,
	id,
	username,
	mutateOnFollow,
}: {
	isFollowing: boolean;
	id: string;
	username: string;
	mutateOnFollow: () => void;
}) {
	const { onClose } = useModalStore();

	const [isLoading, setIsloading] = useState(false);

	const router = useRouter();

	async function onFollow(
		e: React.MouseEvent<HTMLDivElement>,
		isFollowing: boolean
	) {
		e.preventDefault();

		setIsloading(true);

		try {
			if (isFollowing) {
				// Making a DELETE request to the follow API endpoint
				await axios.delete("/api/user/follow", { data: { userId: id } });
			} else {
				// Making a POST request to the follow API endpoint
				await axios.post("/api/user/follow", { userId: id });
			}

			mutateOnFollow();

			// Refresh page to get new followers data
			router.refresh();
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

			if (res.status === 401) {
				onClose();
				router.push(`/auth?from=/profile/${username}`);
			}
		}

		setIsloading(false);
	}

	return (
		<DropdownMenuItem
			disabled={isLoading}
			onClick={(e) => onFollow(e, isFollowing)}
		>
			<UserPlus className="mr-2 h-4 w-4" />
			<span>{isFollowing ? "Unfollow" : "Follow"}</span>
		</DropdownMenuItem>
	);
}
