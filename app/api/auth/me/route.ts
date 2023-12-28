import { NextRequest, NextResponse } from "next/server";
import { authValidation } from "@/lib/auth-validation";

export function GET(req: NextRequest) {
	const authUser = authValidation(req);

	if (!authUser) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	return new NextResponse(JSON.stringify(authUser), { status: 200 });
}

