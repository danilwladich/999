"use client";

import UserActions from "./actions/actions";
import { useAuthMe } from "@/hooks/use-auth-me";
import type { Prisma } from "@prisma/client";

import UserInfo from "./user-info";

type UserWithFollowers = Prisma.UserGetPayload<{
	include: {
		followers: true;
	};
}>;

export default function User({ user }: { user: UserWithFollowers }) {
	const { id, username, imageUrl, followers } = user;

	const { user: authUser } = useAuthMe();

	const isFollowing = followers.some((f) => f.whoFollowId === authUser?.id);

	const isOwner = authUser?.id === id;

	return (
		<div className="flex gap-2 items-center mb-2 last:mb-0">
			<UserInfo username={username} imageUrl={imageUrl} />

			{!isOwner && (
				<UserActions id={id} username={username} isFollowing={isFollowing} />
			)}
		</div>
	);
}
