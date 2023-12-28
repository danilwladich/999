import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import type { User } from "@prisma/client";

type UserWithoutPasswort = Omit<User, "password">;

type AuthValidationReturn = false | UserWithoutPasswort;

export function authValidation(req: NextRequest): AuthValidationReturn {
	const jwtToken = req.cookies.get("jwtToken");

	if (!jwtToken) {
		return false;
	}

	const jwtSecret = process.env.JWT_SECRET || "jwt_secret";

	try {
		const user = jwt.verify(jwtToken.value, jwtSecret) as UserWithoutPasswort;

		return user;
	} catch (e) {
		return false;
	}
}
