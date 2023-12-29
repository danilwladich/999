import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import cookie from "cookie";
import { verifyCaptcha } from "@/lib/server-actions";
import { jsonResponse } from "@/lib/json-response";

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
		const body = loginSchema.safeParse(await req.json());

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

		const isRecaptchaCorrect = verifyCaptcha(recaptchaToken);

		if (!isRecaptchaCorrect) {
			return jsonResponse(
				{
					field: "recaptchaToken",
					message: "Antibot system not passed",
				},
				400
			);
		}

		const user = await db.user.findFirst({
			where: {
				email,
			},
		});

		if (!user) {
			return jsonResponse(
				{
					field: "email",
					message: "User with this email doenst exist",
				},
				400
			);
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			return jsonResponse(
				{
					field: "password",
					message: "Incorrect password",
				},
				400
			);
		}

		const jwtSecret = process.env.JWT_SECRET || "jwt_secret";

		const jwtToken = await new SignJWT({ ...user, password: undefined })
			.setProtectedHeader({ alg: "HS256" })
			.setJti(nanoid())
			.setIssuedAt()
			.setExpirationTime("7d")
			.sign(new TextEncoder().encode(jwtSecret));

		const serialized = cookie.serialize("jwtToken", jwtToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: COOKIE_MAX_AGE,
			sameSite: "strict",
			path: "/",
		});

		return jsonResponse("User successfully loged", 201, {
			headers: { "Set-Cookie": serialized },
		});
	} catch (error) {
		console.log("[LOGIN_POST]", error);
		return jsonResponse(
			{
				field: "email",
				message: "Internal Error",
			},
			400
		);
	}
}
