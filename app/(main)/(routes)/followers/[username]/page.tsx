import { db } from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata({
	params,
}: {
	params: { username: string };
}): Promise<Metadata> {
	const username = params.username;

	return {
		title: `999 | ${username} followers`,
	};
}

export default async function Profile({
	params,
}: {
	params: { username: string };
}) {
	const followersData = await db.user.findFirst({
		where: {
			username: params.username,
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

	const idsList = followersData.followers.map((f) => f.whoFollowId);

	const users = await db.user.findMany({
		where: {
			id: { in: idsList },
		},
	});

	return (
		<div>
			<h2>{params.username} followers</h2>

			{users.map((u) => (
				<p key={u.id}>{u.username}</p>
			))}
		</div>
	);
}
