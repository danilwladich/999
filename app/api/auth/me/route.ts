import { NextRequest } from "next/server";
import { authValidation } from "@/lib/auth-validation";
import { jsonResponse } from "@/lib/json-response";

export async function GET(req: NextRequest) {
	const authUser = await authValidation();

	if (!authUser) {
		return jsonResponse("Unauthorized", 401);
	}

	return jsonResponse(authUser, 200);
}
