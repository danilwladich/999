import { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/json-response";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
	try {
		const username = req.nextUrl.searchParams.get("username");

		if (!username) {
			return jsonResponse("Missing user id", 400);
		}

		const followingsData = await db.user.findFirst({
			where: {
				username,
			},
			select: {
				followings: true,
			},
		});

		if (!followingsData) {
			return jsonResponse([], 200);
		}

		const idsList = followingsData.followings.map((f) => f.whomFollowId);

		const users = await db.user.findMany({
			where: {
				id: { in: idsList },
			},
			include: {
				followers: true,
			},
		});

		const resData = users.map((u) => ({ ...u, password: undefined }));

		return jsonResponse(resData, 200);
	} catch (error) {
		// Handling internal error
		console.log("[FOLLOWINGS_GET]", error);
		return jsonResponse("Internal Error", 500);
	}
}
