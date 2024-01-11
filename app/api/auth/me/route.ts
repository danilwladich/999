import { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/json-response";
import { getAuthUser } from "@/lib/get-auth-user";
import cookie from "cookie";

export function GET(req: NextRequest) {
	const authUser = getAuthUser(req);

	if (!authUser) {
		return jsonResponse("Unauthorized", 401);
	}

	return jsonResponse(authUser, 200);
}

export function DELETE(req: NextRequest) {
	const serialized = cookie.serialize("jwtToken", "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: -1,
		sameSite: "strict",
		path: "/",
	});

	return jsonResponse("User loged out successfully", 200, {
		headers: { "Set-Cookie": serialized },
	});
}
