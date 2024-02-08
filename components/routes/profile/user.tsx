import UserInfo from "./user-info";
import UserFollowers from "./user-followers";
import UserActions from "./actions/actions";
import type { Prisma } from "@prisma/client";

type UserWithFollowers = Prisma.UserGetPayload<{
	include: {
		followers: true;
		followings: true;
	};
}>;

export default function User({
	id,
	username,
	imageUrl,
	followers,
	followings,
}: UserWithFollowers) {
	return (
		<div className="flex flex-col md:flex-row gap-4 justify-between items-center">
			<UserInfo username={username} imageUrl={imageUrl} />

			<div className="flex gap-2 items-center w-full">
				<UserFollowers
					username={username}
					followers={followers}
					followings={followings}
				/>

				<UserActions id={id} username={username} followers={followers} />
			</div>
		</div>
	);
}
