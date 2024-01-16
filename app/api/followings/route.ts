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

		// Retrieving followings data for the specified username
		const followingsData = await db.user.findFirst({
			where: {
				username,
			},
			select: {
				followings: true,
			},
		});

		// Handling case where no followings are found
		if (!followingsData) {
			return jsonResponse([], 200);
		}

		// Extracting following IDs from the followingsData
		const idsList = followingsData.followings.map((f) => f.whomFollowId);

		// Retrieving user data for the followings
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

		// Returning a JSON response with the following data
		return jsonResponse(resData, 200);
	} catch (error) {
		// Handling internal error
		console.log("[FOLLOWINGS_GET]", error);
		return jsonResponse("Internal Error", 500);
	}
}
