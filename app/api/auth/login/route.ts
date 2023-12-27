import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

export async function POST(req: Request) {
	try {
		const body = loginSchema.safeParse(await req.json());

		if (!body.success) {
			return new NextResponse("Validation Error", { status: 400 });
		}

		const { email, password, recaptchaToken } = body.data;

		const isRecaptchaCorrect = verifyCaptcha(recaptchaToken);

		if (!isRecaptchaCorrect) {
			return new NextResponse("Antibot system not passed", {
				status: 400,
			});
		}

		const user = await db.user.findFirst({
			where: {
				email,
			},
		});

		if (!user) {
			return new NextResponse("Incorrect email or password", {
				status: 400,
			});
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			return new NextResponse("Incorrect email or password", {
				status: 400,
			});
		}

		const jwtSecret = process.env.JWT_SECRET || "jwt_secret";

		const jwtToken = jwt.sign(user, jwtSecret, {
			expiresIn: COOKIE_MAX_AGE,
		});

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
		return new NextResponse("Internal Error", { status: 500 });
	}
}
