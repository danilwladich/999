import type { NextRequest } from "next/server";
import { jsonResponse } from "@/lib/json-response";
import { getAuthUser } from "@/lib/get-auth-user";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
	try {
		const { articleId } = await req.json();

		if (!articleId) {
			return jsonResponse("Article id required", 400);
		}

		const article = await db.article.findFirst({
			where: {
				id: articleId,
			},
			include: {
				favorites: true,
			},
		});

		if (!article) {
			return jsonResponse("Article doesn't exist", 400);
		}

		const authUser = getAuthUser(req);

		if (article.favorites.some((f) => f.userId === authUser.id)) {
			return jsonResponse("This article already your favorite", 400);
		}

		await db.favoriteArticle.create({
			data: {
				userId: authUser.id,
				articleId: article.id,
			},
		});

		return jsonResponse("Article favorite successfully", 201);
	} catch (error) {
		// Handling internal error
		console.log("[ARTICLE_FAVORITE_POST]", error);
		return jsonResponse("Internal Error", 500);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const { articleId } = await req.json();

		if (!articleId) {
			return jsonResponse("Article id required", 400);
		}

		const authUser = getAuthUser(req);

		const favoriteArticle = await db.favoriteArticle.findFirst({
			where: {
				articleId,
				userId: authUser.id,
			},
		});

		if (!favoriteArticle) {
			return jsonResponse("This article is not your favorite", 400);
		}

		await db.favoriteArticle.delete({
			where: {
				id: favoriteArticle.id,
			},
		});

		return jsonResponse("Article unfavorite successfully", 201);
	} catch (error) {
		// Handling internal error
		console.log("[ARTICLE_FAVORITE_DELETE]", error);
		return jsonResponse("Internal Error", 500);
	}
}
