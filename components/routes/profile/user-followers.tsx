import Link from "next/link";
import type { Follow } from "@prisma/client";

import { Button } from "@/components/ui/button";

export default function UserFollowers({
	username,
	followers,
	followings,
}: {
	username: string;
	followers: Follow[];
	followings: Follow[];
}) {
	return (
		<>
			<Link href={`/followers/${username}`} className="flex-1">
				<Button variant="outline" className="w-full">
					Followers {followers.length}
				</Button>
			</Link>

			<Link href={`/followings/${username}`} className="flex-1">
				<Button variant="outline" className="w-full">
					Followings {followings.length}
				</Button>
			</Link>
		</>
	);
}
