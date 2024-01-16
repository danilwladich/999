import type { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/json-response";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
	try {
		// Extracting username from the request URL query parameters
		const username = req.nextUrl.searchParams.get("username");

		// Handling missing username error
		if (!username) {
			return jsonResponse("Missing user id", 400);
		}

		// Retrieving followers data for the specified username
		const followersData = await db.user.findFirst({
			where: {
				username,
			},
			select: {
				followers: true,
			},
		});

		// Handling case where no followers are found
		if (!followersData) {
			return jsonResponse([], 200);
		}

		// Extracting follower IDs from the followersData
		const idsList = followersData.followers.map((f) => f.whoFollowId);

		// Retrieving user data for the followers
		const users = await db.user.findMany({
			where: {
				id: { in: idsList },
			},
			include: {
				followers: true,
			},
		});

		// Creating response data by removing passwords from user objects
		const resData = users.map((u) => ({ ...u, password: undefined }));

		// Returning a JSON response with the follower data
		return jsonResponse(resData, 200);
	} catch (error) {
		// Handling internal error
		console.log("[FOLLOWERS_GET]", error);
		return jsonResponse("Internal Error", 500);
	}
}
