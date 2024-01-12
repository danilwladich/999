import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { UserWithoutPassword } from "@/types/UserWithoutPassword";

export async function authValidation(): Promise<
	UserWithoutPassword | undefined
> {
	// Extracting JWT token from the "jwtToken" cookie
	const cookieStore = cookies();
	const jwtToken = cookieStore.get("jwtToken")?.value;

	// Checking if the JWT token is present
	if (!jwtToken) {
		return undefined;
	}

	const jwtSecret = process.env.JWT_SECRET || "jwt_secret";

	try {
		// Verifying the JWT token using the provided secret
		const verified = await jwtVerify(
			jwtToken,
			new TextEncoder().encode(jwtSecret)
		);

		// Extracting user information from the verified payload
		const user = verified.payload as UserWithoutPassword;

		// Returning the authenticated user information
		return user;
	} catch (e) {
		// Handling errors during JWT verification
		console.log("[AUTH_VALIDATION]", e);
		return undefined;
	}
}
