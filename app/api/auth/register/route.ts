import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { verifyCaptcha } from "@/lib/server-actions";
import { jsonResponse } from "@/lib/json-response";
import { serializeJwt } from "@/lib/serialize-jwt";

// Defining a schema for the registration request body using Zod
export const registerSchema = z
	.object({
		username: z
			.string()
			.trim()
			.regex(/^\w+$/g, "Username must be alphanumeric.")
			.min(4, {
				message: "Username must be at least 4 characters.",
			})
			.max(16, { message: "Username must be less than 16 characters." }),
		email: z.string().trim().email("This is not a valid email."),
		password: z
			.string()
			.trim()
			.min(6, {
				message: "Password must be at least 6 characters.",
			})
			.regex(/[A-Z]/g, "Password must contain at least 1 uppercase letter.")
			.regex(/[a-z]/g, "Password must contain at least 1 lowercase letter.")
			.regex(/[0-9]/g, "Password must contain at least 1 digit.")
			.refine((value) => !/\s/.test(value), {
				message: "Password cannot contain whitespaces.",
			}),
		confirmPassword: z.string().trim().min(1, {
			message: "This field has to be filled.",
		}),
		recaptchaToken: z.string(),
	})
	.refine(
		// Additional refinement to check if passwords match in client
		(data) => data.password === data.confirmPassword,
		{
			message: "Passwords don't match.",
			path: ["confirmPassword"],
		}
	);

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
