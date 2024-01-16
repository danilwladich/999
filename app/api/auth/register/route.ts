import { db } from "@/lib/db";
import type { NextRequest } from "next/server";
import { registerSchema } from "@/lib/form-schema";
import bcrypt from "bcryptjs";
import { verifyCaptcha } from "@/lib/server-actions";
import { jsonResponse } from "@/lib/json-response";
import { serializeJwt } from "@/lib/serialize-jwt";

export async function POST(req: NextRequest) {
	try {
		// Parsing and validating the request body
		const body = registerSchema.safeParse(await req.json());

		// Handling validation errors
		if (!body.success) {
			return jsonResponse(
				{
					field: "validation",
					message: "Validation Error",
				},
				400
			);
		}

		const { username, email, password, recaptchaToken } = body.data;

		// Verifying the recaptcha token
		const isRecaptchaCorrect = verifyCaptcha(recaptchaToken);

		// Handling recaptcha verification failure
		if (!isRecaptchaCorrect) {
			return jsonResponse(
				{
					field: "recaptchaToken",
					message: "Antibot system not passed",
				},
				400
			);
		}

		// Checking if a user with the provided email already exists
		const userAlreadyExist = !!(await db.user.findFirst({
			where: {
				email,
			},
		}));

		// Handling existing user with the provided email error
		if (userAlreadyExist) {
			return jsonResponse(
				{
					field: "email",
					message: "User with this email already exists",
				},
				400
			);
		}

		// Checking if the provided username is already taken
		const usernameAlreadyTaken = !!(await db.user.findFirst({
			where: {
				username,
			},
		}));

		// Handling existing username error
		if (usernameAlreadyTaken) {
			return jsonResponse(
				{
					field: "username",
					message: "Username already taken",
				},
				400
			);
		}

		// Hashing the password
		const hashedPassword = await bcrypt.hash(password, 12);

		// Creating a new user
		const user = await db.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
				imageUrl: "",
			},
		});

		// Serializing the user object into a JWT token
		const userWithoutPassword = { ...user, password: undefined };
		const serialized = await serializeJwt(userWithoutPassword);

		// Returning a JSON response with user information and set cookie header
		return jsonResponse(userWithoutPassword, 201, {
			headers: { "Set-Cookie": serialized },
		});
	} catch (error) {
		// Handling internal error
		console.log("[REGISTER_POST]", error);
		return jsonResponse(
			{
				field: "internal",
				message: "Internal Error",
			},
			500
		);
	}
}
