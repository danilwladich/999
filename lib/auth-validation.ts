import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import type { User } from "@prisma/client";

type UserWithoutPasswort = Omit<User, "password">;

export async function authValidation(
	req: NextRequest
): Promise<UserWithoutPasswort | false> {
	const jwtToken = req.cookies.get("jwtToken")?.value;

	if (!jwtToken) {
		return false;
	}

	const jwtSecret = process.env.JWT_SECRET || "jwt_secret";

	try {
		const verified = await jwtVerify(
			jwtToken,
			new TextEncoder().encode(jwtSecret)
		);

		const user = verified.payload as UserWithoutPasswort;

		return user;
	} catch (e) {
		console.log("[AUTH_VALIDATION]", e);
		return false;
	}
}
