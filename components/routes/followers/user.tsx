"use client";

import { Prisma } from "@prisma/client";
import UserActions from "./actions/actions";

import UserInfo from "./user-info";

type UserWithFollowers = Prisma.UserGetPayload<{
	include: {
		followers: true;
	};
}>;

export default function User({
	user,
	isFollowing,
	isOwner,
	mutateOnFollow,
}: {
	user: UserWithFollowers;
	isFollowing: boolean;
	isOwner: boolean;
	mutateOnFollow: (isFollowing: boolean) => void;
}) {
	const { id, username, imageUrl, followers } = user;

	return (
		<div className="flex gap-2 items-center">
			<UserInfo username={username} imageUrl={imageUrl} />

			{!isOwner && (
				<UserActions
					id={id}
					username={username}
					followers={followers}
					isFollowing={isFollowing}
					mutateOnFollow={() => mutateOnFollow(isFollowing)}
				/>
			)}
		</div>
	);
}
