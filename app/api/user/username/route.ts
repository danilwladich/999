import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import * as z from "zod";
import { jsonResponse } from "@/lib/json-response";
import { getAuthUser } from "@/lib/get-auth-user";
import { serializeJwt } from "@/lib/serialize-jwt";

export const editUsernameSchema = z.object({
	username: z
		.string()
		.trim()
		.regex(/^\w+$/g, "Username must be alphanumeric.")
		.min(4, {
			message: "Username must be at least 4 characters.",
		})
		.max(16, { message: "Username must be less than 16 characters." }),
});

export async function PATCH(req: NextRequest) {
	try {
		const authUser = getAuthUser(req);

		// Parsing and validating the request body
		const body = editUsernameSchema.safeParse(await req.json());

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

		const { username } = body.data;

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

		const user = await db.user.update({
			where: {
				id: authUser.id,
			},
			data: {
				username,
			},
		});

		const userWithoutPassword = { ...user, password: undefined };

		const serialized = await serializeJwt(userWithoutPassword);

		// Returning a JSON response with user information and set cookie header
		return jsonResponse(userWithoutPassword, 200, {
			headers: { "Set-Cookie": serialized },
		});
	} catch (error) {
		// Handling internal error
		console.log("[USER_USERNAME_PATCH]", error);
		return jsonResponse("Internal Error", 500);
	}
}
