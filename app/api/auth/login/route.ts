import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import cookie from "cookie";
import { verifyCaptcha } from "@/lib/server-actions";
import { jsonResponse } from "@/lib/json-response";

// Defining a schema for the login request body using Zod
export const loginSchema = z.object({
	email: z.string().email("This is not a valid email."),
	password: z.string().min(6, {
		message: "Password must be at least 6 characters.",
	}),
	recaptchaToken: z.string(),
});

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(req: NextRequest) {
	try {
		// Parsing and validating the request body
		const body = loginSchema.safeParse(await req.json());

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

		const { email, password, recaptchaToken } = body.data;

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

		// Find a user with the provided email
		const user = await db.user.findFirst({
			where: {
				email,
			},
		});

		// Handling non-existent user error
		if (!user) {
			return jsonResponse(
				{
					field: "email",
					message: "User with this email doesn't exist",
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
					message: "Incorrect password",
				},
				400
			);
		}

		// Generating a JWT token with user information excluding the password
		const jwtSecret = process.env.JWT_SECRET || "jwt_secret";
		const userWithoutPassword = { ...user, password: undefined };
		const jwtToken = await new SignJWT(userWithoutPassword)
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

		// Returning a JSON response with user information and set cookie header
		return jsonResponse(userWithoutPassword, 201, {
			headers: { "Set-Cookie": serialized },
		});
	} catch (error) {
		// Handling internal error
		console.log("[LOGIN_POST]", error);
		return jsonResponse(
			{
				field: "email",
				message: "Internal Error",
			},
			500
		);
	}
}