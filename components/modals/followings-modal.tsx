"use client";

import { Prisma } from "@prisma/client";
import { useParams } from "next/navigation";
import { useAuthMe } from "@/hooks/use-auth-me";
import { useClientFetching } from "@/hooks/use-client-fetching";
import User from "../routes/followers/user";

import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type UserWithFollowers = Prisma.UserGetPayload<{
	include: {
		followers: true;
	};
}>;

export default function FollowersModal() {
	const { username } = useParams();

	const { user: authUser } = useAuthMe();

	const {
		data: users,
		error,
		mutate,
	} = useClientFetching<UserWithFollowers[]>(
		`/api/followings?username=${username}`
	);

	function mutateOnFollow(isFollowing: boolean, userId: string) {
		if (!users || !authUser) {
			return;
		}

		if (isFollowing) {
			const mutatedUsers = users.map((u) => {
				if (u.id === userId) {
					const mutatedFollowers = u.followers.filter(
						(f) => f.whoFollowId !== authUser.id
					);

					return {
						...u,
						followers: mutatedFollowers,
					};
				}

				return u;
			});

			mutate(mutatedUsers, { revalidate: false });

			return;
		}

		const mutatedUsers = users.map((u) => {
			if (u.id === userId) {
				const mutatedFollowers = [
					...u.followers,
					{ id: 0, whoFollowId: authUser.id, whomFollowId: u.id },
				];

				return {
					...u,
					followers: mutatedFollowers,
				};
			}

			return u;
		});

		mutate(mutatedUsers, { revalidate: false });
	}

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader className="overflow-hidden">
				<DialogTitle className="truncate">{username} followings</DialogTitle>
				<DialogDescription>
					{users?.length ?? "..."} followings
				</DialogDescription>
			</DialogHeader>
			{!!error && <p>{error.message}</p>}

			{!users && !error && <p>Loading</p>}

			{!!users &&
				users.map((u) => (
					<User
						key={u.id}
						user={u}
						isFollowing={u.followers.some(
							(f) => f.whoFollowId === authUser?.id
						)}
						isOwner={authUser?.id === u.id}
						mutateOnFollow={(isFollowing) => mutateOnFollow(isFollowing, u.id)}
					/>
				))}
		</DialogContent>
	);
}
