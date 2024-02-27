import { db } from "@/lib/db";
import Link from "next/link";
import User from "@/components/routes/followers/user";
import type { Metadata } from "next";
import { getAppTitle } from "@/lib/get-app-title";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export async function generateMetadata({
	params,
}: {
	params: { username: string };
}): Promise<Metadata> {
	const user = await db.user.findFirst({
		where: {
			username: params.username,
		},
	});

	return {
		title: getAppTitle(user ? `${user?.username} followers` : "User not found"),
	};
}

export default async function Followers({
	params,
}: {
	params: { username: string };
}) {
	const { username } = params;

	// Retrieving followers data for the specified username
	const followersData = await db.user.findFirst({
		where: {
			username,
		},
		select: {
			followers: true,
		},
	});

	if (!followersData) {
		return (
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<h2 className="text-xl">User not found</h2>
			</div>
		);
	}

	// Extracting follower IDs from the followersData
	const idsList = followersData.followers.map((f) => f.whoFollowId);

	// Retrieving user data for the followers
	const usersData = await db.user.findMany({
		where: {
			id: { in: idsList },
		},
		include: {
			followers: true,
		},
	});

	const users = usersData.map((u) => ({
		...u,
		password: "",
	}));

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<Link href={`/profile/${username}`} className="hover:underline">
						{username}
					</Link>
					<span> followers</span>
				</CardTitle>
				<CardDescription>{users.length} followers</CardDescription>
			</CardHeader>

			<CardContent>
				{users.map((u) => (
					<User key={u.id} user={u} />
				))}
			</CardContent>
		</Card>
	);
}
