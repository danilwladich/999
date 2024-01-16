import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import * as z from "zod";
import { jsonResponse } from "@/lib/json-response";
import { getAuthUser } from "@/lib/get-auth-user";
import { serializeJwt } from "@/lib/serialize-jwt";
import { parseJsonFromFormData } from "@/lib/formdata-parser";
import path from "path";
import fs from "fs/promises";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
];

export const editAvatarSchema = z.object({
	image: z
		.any()
		.refine((file) => !!file, "No image provided.")
		.refine(
			(file) => file?.size <= MAX_FILE_SIZE,
			`Max image size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
		)
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
			"Only .jpg, .jpeg, .png and .webp formats are supported."
		),
});

export async function PATCH(req: NextRequest) {
	try {
		// Parsing and validating the request body
		const data = parseJsonFromFormData(await req.formData());
		const body = editAvatarSchema.safeParse(data);

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

		const { image } = body.data as { image: File };

		const authUser = getAuthUser(req);

		// Creating the file path for the user's avatar
		const filepath = path.join(
			process.cwd(),
			"public/images/users",
			authUser.id,
			"avatar"
		);

		// Create dir if not exists
		try {
			await fs.access(filepath);
		} catch {
			await fs.mkdir(filepath, { recursive: true });
		}

		// Delete old avatar
		const files = await fs.readdir(filepath);
		for (const file of files) {
			await fs.unlink(path.join(filepath, file));
		}

		// Reading and save the new avatar image
		const imageBuffer = Buffer.from(await image.arrayBuffer());
		const filename = `${Date.now()}_${image.name.replaceAll(" ", "_")}`;

		await fs.writeFile(path.join(filepath, filename), imageBuffer);

		// Setting the new imageUrl for the user
		const imageUrl = path.join(
			"/images/users",
			authUser.id,
			"avatar",
			filename
		);

		const user = await db.user.update({
			where: {
				id: authUser.id,
			},
			data: {
				imageUrl,
			},
		});

		// Serializing the user object into a JWT token
		const userWithoutPassword = { ...user, password: undefined };
		const serialized = await serializeJwt(userWithoutPassword);

		// Returning a JSON response with user information and set cookie header
		return jsonResponse(userWithoutPassword, 200, {
			headers: { "Set-Cookie": serialized },
		});
	} catch (error) {
		// Handling internal error
		console.log("[USER_AVATAR_PATCH]", error);
		return jsonResponse("Internal Error", 500);
	}
}
