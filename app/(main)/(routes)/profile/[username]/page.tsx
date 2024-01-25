import { db } from "@/lib/db";
import User from "@/components/routes/profile/user";
import { Article } from "@/components/common/article";
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
			articles: {
				include: {
					imagesUrl: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			},
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
		<div className="flex flex-col gap-4 pt-2 md:pt-0">
			<Card>
				<CardContent>
					<User {...user} />
				</CardContent>
			</Card>

			{user.articles.length > 0 && (
				<Card>
					<CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
						{user.articles.map((a) => (
							<Article key={a.id} {...a} />
						))}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
