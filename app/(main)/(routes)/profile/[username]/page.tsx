import { db } from "@/lib/db";
import User from "@/components/routes/profile/user";
import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({
	params,
}: {
	params: { username: string };
}): Promise<Metadata> {
	const username = params.username;

	return {
		title: `999 | ${username}`,
	};
}

export default async function Profile({
	params,
}: {
	params: { username: string };
}) {
	const user = await db.user.findFirst({
		where: {
			username: params.username,
		},
		include: {
			followers: true,
			followings: true,
		},
	});

	if (!user) {
		return (
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<h2 className="text-xl">User not found</h2>
			</div>
		);
	}

	return (
		<Card className="pt-2 md:pt-0">
			<CardContent>
				<User {...user} />
			</CardContent>
		</Card>
	);
}
