import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import type { User } from "@prisma/client";

type UserWithoutPasswort = Omit<User, "password">;

type AuthValidationReturn = false | UserWithoutPasswort;

export async function authValidation(
	req: NextRequest
): Promise<AuthValidationReturn> {
	try {
		const jwtToken = req.cookies.get("jwtToken")?.value;

		if (!jwtToken) {
			return false;
		}

		const jwtSecret = process.env.JWT_SECRET || "jwt_secret";

		const verified = await jwtVerify(
			jwtToken,
			new TextEncoder().encode(jwtSecret)
		);

		const user = verified.payload as UserWithoutPasswort;

		return user;
	} catch (e) {
		console.log(e);
		return false;
	}
}
