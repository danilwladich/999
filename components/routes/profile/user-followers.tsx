"use client";

import { useModalStore } from "@/hooks/use-modal-store";

import { Button } from "@/components/ui/button";
import type { Follow } from "@prisma/client";

export default function UserFollowers({
	followers,
	followings,
}: {
	followers: Follow[];
	followings: Follow[];
}) {
	const { onOpen } = useModalStore();

	return (
		<>
			<Button
				variant="outline"
				className="flex-1"
				onClick={() => onOpen("followers")}
			>
				Followers {followers.length}
			</Button>

			<Button
				variant="outline"
				className="flex-1"
				onClick={() => onOpen("followings")}
			>
				Followings {followings.length}
			</Button>
		</>
	);
}
