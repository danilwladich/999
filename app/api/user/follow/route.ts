import { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/json-response";
import { getAuthUser } from "@/lib/get-auth-user";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
	try {
		const { userId } = await req.json();

		if (!userId) {
			return jsonResponse("User id required", 400);
		}

		const user = await db.user.findFirst({
			where: {
				id: userId,
			},
			include: {
				followers: true,
			},
		});

		if (!user) {
			return jsonResponse("User doesn't exist", 400);
		}

		const authUser = getAuthUser(req);

		if (user.id === authUser.id) {
			return jsonResponse("You can't follow yourself", 400);
		}

		if (user.followers.some((f) => f.whoFollowId === authUser.id)) {
			return jsonResponse("You already following this user", 400);
		}

		await db.follow.create({
			data: {
				whoFollowId: authUser.id,
				whomFollowId: user.id,
			},
		});

		return jsonResponse("User followed successfully", 201);
	} catch (error) {
		// Handling internal error
		console.log("[USER_FOLLOW_POST]", error);
		return jsonResponse("Internal Error", 500);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const { userId } = await req.json();

		if (!userId) {
			return jsonResponse("User id required", 400);
		}

		const user = await db.user.findFirst({
			where: {
				id: userId,
			},
			include: {
				followers: true,
			},
		});

		if (!user) {
			return jsonResponse("User doesn't exist", 400);
		}

		const authUser = getAuthUser(req);

		const follow = await db.follow.findFirst({
			where: {
				whoFollowId: authUser.id,
				whomFollowId: user.id,
			},
		});

		if (!follow) {
			return jsonResponse("You don't follow this user", 400);
		}

		await db.follow.delete({
			where: {
				id: follow.id,
			},
		});

		return jsonResponse("User unfollowed successfully", 201);
	} catch (error) {
		// Handling internal error
		console.log("[USER_FOLLOW_DELETE]", error);
		return jsonResponse("Internal Error", 500);
	}
}
