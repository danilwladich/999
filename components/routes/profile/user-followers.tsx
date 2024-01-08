import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Follow } from "@prisma/client";

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
			<Link href={`/followers/${username}`}>
				<Button variant="outline" className="flex-1">
					{`Followers ${followers.length}`}
				</Button>
			</Link>

			<Link href={`/followings/${username}`}>
				<Button variant="outline" className="flex-1">
					{`Followings ${followings.length}`}
				</Button>
			</Link>
		</>
	);
}
