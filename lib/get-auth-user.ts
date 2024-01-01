import { NextRequest } from "next/server";

export function getAuthUser(req: NextRequest) {
	return JSON.parse(req.headers.get("x-auth-user") || "");
}
