import type { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/json-response";
import { editPasswordSchema } from "@/lib/form-schema";
import { getAuthUser } from "@/lib/get-auth-user";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { emptyJwt } from "@/lib/serialize-jwt";

export async function PATCH(req: NextRequest) {
	try {
		// Parsing and validating the request body
		const body = editPasswordSchema.safeParse(await req.json());

		// Handling validation errors
		if (!body.success) {
			return jsonResponse("Validation Error", 400);
		}

		const { oldPassword, newPassword } = body.data;

		const authUser = getAuthUser(req);

		const user = await db.user.findFirst({
			where: {
				id: authUser.id,
			},
		});

		if (!user) {
			return jsonResponse("Auth error", 400);
		}

		// Comparing the provided password with the hashed password
		const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

		if (!isPasswordCorrect) {
			return jsonResponse(
				{
					field: "oldPassword",
					message: `Incorrect password`,
				},
				400
			);
		}

		// Hashing the password
		const hashedPassword = await bcrypt.hash(newPassword, 12);

		// Updating password
		await db.user.update({
			where: { id: user.id },
			data: {
				password: hashedPassword,
			},
		});

		const serialized = emptyJwt();

		return jsonResponse("User password changed successfully", 200, {
			headers: { "Set-Cookie": serialized },
		});
	} catch (error) {
		// Handling internal error
		console.log("[USER_PASSWORD_PATCH]", error);
		return jsonResponse("Internal Error", 500);
	}
}
