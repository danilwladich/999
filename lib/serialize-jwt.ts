import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import cookie from "cookie";
import { UserWithoutPassword } from "@/types/UserWithoutPassword";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function serializeJwt(user: UserWithoutPassword) {
	// Generating a JWT token with user information excluding the password
	const jwtSecret = process.env.JWT_SECRET || "jwt_secret";

	const jwtToken = await new SignJWT(user)
		.setProtectedHeader({ alg: "HS256" })
		.setJti(nanoid())
		.setIssuedAt()
		.setExpirationTime("7d")
		.sign(new TextEncoder().encode(jwtSecret));

	// Serializing the JWT token as a cookie and setting the response headers
	const serialized = cookie.serialize("jwtToken", jwtToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: COOKIE_MAX_AGE,
		sameSite: "strict",
		path: "/",
	});

	return serialized;
}
