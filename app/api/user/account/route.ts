import type { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/json-response";
import { deleteAccountSchema } from "@/lib/form-schema";
import { getAuthUser } from "@/lib/get-auth-user";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { emptyJwt } from "@/lib/serialize-jwt";
import path from "path";
import fs from "fs/promises";

export async function DELETE(req: NextRequest) {
	try {
		// Parsing and validating the request body
		const body = deleteAccountSchema.safeParse(await req.json());

		// Handling validation errors
		if (!body.success) {
			return jsonResponse("Validation Error", 400);
		}

		const { password } = body.data;

		const authUser = getAuthUser(req);

		// Find auth user by id
		const user = await db.user.findFirst({
			where: {
				id: authUser.id,
			},
			select: {
				password: true,
				articles: true,
			},
		});

		if (!user) {
			return jsonResponse("Auth error", 400);
		}

		// Comparing the provided password with the hashed password
		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			return jsonResponse(
				{
					field: "password",
					message: `Incorrect password`,
				},
				400
			);
		}

		// Delete user images
		const filepath = path.join(
			process.cwd(),
			"public/images/users",
			authUser.id
		);
		try {
			await fs.access(filepath);
			await fs.rm(filepath, { recursive: true });
		} catch {}

		// Delete all articles
		for (const { id: articleId } of user.articles) {
			// Delete article images
			await db.articleImage.deleteMany({
				where: {
					articleId,
				},
			});

			const articleFilepath = path.join(
				process.cwd(),
				"public/images/articles",
				articleId
			);
			try {
				await fs.access(articleFilepath);
				await fs.rm(articleFilepath, { recursive: true });
			} catch {}

			// Delete article favorites
			await db.favoriteArticle.deleteMany({
				where: {
					articleId,
				},
			});
		}

		await db.article.deleteMany({
			where: {
				userId: authUser.id,
			},
		});

		// Delete user followings
		await db.follow.deleteMany({
			where: {
				whoFollowId: authUser.id,
			},
		});

		// Delete user followers
		await db.follow.deleteMany({
			where: {
				whomFollowId: authUser.id,
			},
		});

		// Delete the user
		await db.user.delete({
			where: {
				id: authUser.id,
			},
		});

		const serialized = emptyJwt();

		return jsonResponse("User deleted successfully", 200, {
			headers: { "Set-Cookie": serialized },
		});
	} catch (error) {
		// Handling internal error
		console.log("[USER_ACCOUNT_DELETE]", error);
		return jsonResponse("Internal Error", 500);
	}
}
