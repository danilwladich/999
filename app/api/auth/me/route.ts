import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
	const cookieStore = cookies();

	const jwtToken = cookieStore.get("jwtToken");

	if (!jwtToken) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const jwtSecret = process.env.JWT_SECRET || "jwt_secret";

	try {
		const user = jwt.verify(jwtToken.value, jwtSecret);

		const response = {
			user,
		};

		return new NextResponse(JSON.stringify(response), { status: 200 });
	} catch (e) {
		return new NextResponse("Unauthorized", { status: 401 });
	}
}
