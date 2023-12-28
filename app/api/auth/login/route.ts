import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import cookie from "cookie";
import { verifyCaptcha } from "@/lib/server-actions";

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
			return new NextResponse("Validation Error", { status: 400 });
		}

		const { email, password, recaptchaToken } = body.data;

		const isRecaptchaCorrect = verifyCaptcha(recaptchaToken);

		if (!isRecaptchaCorrect) {
			return new NextResponse(
				JSON.stringify({
					field: "recaptchaToken",
					message: "Antibot system not passed",
				}),
				{
					status: 400,
				}
			);
		}

		const user = await db.user.findFirst({
			where: {
				email,
			},
		});

		if (!user) {
			return new NextResponse(
				JSON.stringify({
					field: "email",
					message: "User with this email doenst exist",
				}),
				{
					status: 400,
				}
			);
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			return new NextResponse(
				JSON.stringify({
					field: "password",
					message: "Incorrect password",
				}),
				{
					status: 400,
				}
			);
		}

		const jwtSecret = process.env.JWT_SECRET || "jwt_secret";

		const jwtToken = await new SignJWT({ ...user, password: undefined })
			.setProtectedHeader({ alg: "HS256" })
			.setJti(nanoid())
			.setIssuedAt()
			.setExpirationTime(COOKIE_MAX_AGE)
			.sign(new TextEncoder().encode(jwtSecret));

		const serialized = cookie.serialize("jwtToken", jwtToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: COOKIE_MAX_AGE,
			sameSite: "strict",
			path: "/",
		});

		return new NextResponse("User successfully loged", {
			status: 201,
			headers: { "Set-Cookie": serialized },
		});
	} catch (error) {
		console.log("[LOGIN_POST]", error);
		return new NextResponse(
			JSON.stringify({
				field: "email",
				message: "Internal Error",
			}),
			{ status: 500 }
		);
	}
}
