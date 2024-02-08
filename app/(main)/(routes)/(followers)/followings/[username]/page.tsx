import { db } from "@/lib/db";
import Link from "next/link";
import User from "@/components/routes/followers/user";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default async function Followers({
	params,
}: {
	params: { username: string };
}) {
	const { username } = params;

	// Retrieving followings data for the specified username
	const followingsData = await db.user.findFirst({
		where: {
			username,
		},
		select: {
			followings: true,
		},
	});

	if (!followingsData) {
		return (
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<h2 className="text-xl">User not found</h2>
			</div>
		);
	}

	// Extracting following IDs from the followingsData
	const idsList = followingsData.followings.map((f) => f.whomFollowId);

	// Retrieving user data for the followings
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
					<span> followings</span>
				</CardTitle>
				<CardDescription>{users.length} followings</CardDescription>
			</CardHeader>

			<CardContent>
				{users.map((u) => (
					<User key={u.id} user={u} />
				))}
			</CardContent>
		</Card>
	);
}
