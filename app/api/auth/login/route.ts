import { db } from "@/lib/db";
import type { NextRequest } from "next/server";
import { loginSchema } from "@/lib/form-schema";
import bcrypt from "bcryptjs";
import { verifyCaptcha } from "@/lib/server-actions";
import { jsonResponse } from "@/lib/json-response";
import { serializeJwt } from "@/lib/serialize-jwt";

export async function POST(req: NextRequest) {
	try {
		// Parsing and validating the request body
		const body = loginSchema.safeParse(await req.json());

		// Handling validation errors
		if (!body.success) {
			return jsonResponse("Validation Error", 400);
		}

		const { emailOrUsername, password, recaptchaToken } = body.data;

		// Verifying the recaptcha token
		const isRecaptchaCorrect = verifyCaptcha(recaptchaToken);

		// Handling recaptcha verification failure
		if (!isRecaptchaCorrect) {
			return jsonResponse("Antibot system not passed", 400);
		}

		// Checking whether the provided identifier is an email or username
		const itsEmail = emailOrUsername.includes("@");

		// Array of conditions for the database query based on email or username
		const type = itsEmail ? "email" : "username";

		// Fetching the user from the database
		const user = await db.user.findFirst({
			where: {
				[type]: emailOrUsername,
			},
		});

		// Handling non-existent user error
		if (!user) {
			return jsonResponse(
				{
					field: "password",
					message: `Incorrect ${itsEmail ? "email" : "username"} or password`,
				},
				400
			);
		}

		// Comparing the provided password with the hashed password
		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		// Handling incorrect password error
		if (!isPasswordCorrect) {
			return jsonResponse(
				{
					field: "password",
					message: `Incorrect ${itsEmail ? "email" : "username"} or password`,
				},
				400
			);
		}

		// Serializing the user object into a JWT token
		const userWithoutPassword = { ...user, password: undefined };
		const serialized = await serializeJwt(userWithoutPassword);

		// Returning a JSON response with user information and set cookie header
		return jsonResponse(userWithoutPassword, 200, {
			headers: { "Set-Cookie": serialized },
		});
	} catch (error) {
		// Handling internal error
		console.log("[LOGIN_POST]", error);
		return jsonResponse("Internal Error", 500);
	}
}
