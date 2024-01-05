import { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/json-response";
import { getAuthUser } from "@/lib/get-auth-user";

export function GET(req: NextRequest) {
	const authUser = getAuthUser(req);

	if (!authUser) {
		return jsonResponse("Unauthorized", 401);
	}

	return jsonResponse(authUser, 200);
}
