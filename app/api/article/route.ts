import { db } from "@/lib/db";
import type { NextRequest } from "next/server";
import { articleSchema, articleEditSchema } from "@/lib/form-schema";
import { jsonResponse } from "@/lib/json-response";
import { getAuthUser } from "@/lib/get-auth-user";
import { parseJsonFromFormData } from "@/lib/formdata-parser";
import { verifyCaptcha } from "@/lib/server-actions";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
	try {
		// Parsing and validating the request body
		const data = parseJsonFromFormData(await req.formData());
		const body = articleSchema.safeParse(data);

		// Handling validation errors
		if (!body.success) {
			return jsonResponse("Validation Error", 400);
		}

		const { title, description, images, amount, currency, recaptchaToken } =
			body.data;

		// Verifying the recaptcha token
		const isRecaptchaCorrect = verifyCaptcha(recaptchaToken);

		// Handling recaptcha verification failure
		if (!isRecaptchaCorrect) {
			return jsonResponse("Antibot system not passed", 400);
		}

		const authUser = getAuthUser(req);

		// Creating the new article
		const article = await db.article.create({
			data: {
				userId: authUser.id,
				title,
				description,
				amount: +amount,
				currency,
			},
		});

		if (images?.length) {
			// Creating the file path for article images
			const filepath = path.join(
				process.cwd(),
				"public/images/articles",
				article.id
			);

			// Create directory if it doesn't exist
			try {
				await fs.access(filepath);
			} catch {
				await fs.mkdir(filepath, { recursive: true });
			}

			for (const [index, image] of images.entries()) {
				// Reading and save the new article image
				const imageBuffer = Buffer.from(await image.arrayBuffer());
				const imageName = image.name.replaceAll(" ", "_");
				const filename = `${index}_${Date.now()}_${imageName}`;

				await fs.writeFile(path.join(filepath, filename), imageBuffer);

				// Setting the new imageUrl for the article
				const imageUrl = path.join("/images/articles", article.id, filename);

				await db.articleImage.create({
					data: {
						articleId: article.id,
						imageUrl,
					},
				});
			}
		}

		return jsonResponse(article.id, 201);
	} catch (error) {
		// Handling internal error
		console.log("[ARTICLE_POST]", error);
		return jsonResponse("Internal Error", 500);
	}
}

export async function PATCH(req: NextRequest) {
	try {
		// Parsing and validating the request body
		const data = parseJsonFromFormData(await req.formData());
		const body = articleEditSchema.safeParse(data);

		// Handling validation errors
		if (!body.success) {
			return jsonResponse("Validation Error", 400);
		}

		const { id, title, description, images, amount, currency } = body.data;

		const authUser = getAuthUser(req);

		// Check if the article exists with the provided ID and owner ID
		const isArticleExist = !!(await db.article.findFirst({
			where: {
				id,
				userId: authUser.id,
			},
		}));

		if (!isArticleExist) {
			return jsonResponse(
				"Article with the provided id and owner id doesn't exist",
				400
			);
		}

		// Update existing article
		const article = await db.article.update({
			where: {
				id,
			},
			data: {
				userId: authUser.id,
				title,
				description,
				amount: +amount,
				currency,
			},
			include: {
				imagesUrl: true,
			},
		});

		// Removing article images dir
		const filepath = path.join(
			process.cwd(),
			"public/images/articles",
			article.id
		);
		await fs.rm(filepath, { recursive: true });

		if (images?.length) {
			// Create directory if it doesn't exist
			try {
				await fs.access(filepath);
			} catch {
				await fs.mkdir(filepath, { recursive: true });
			}

			for (const [index, image] of images.entries()) {
				// Reading and save the new article image or update existing
				const imageBuffer = Buffer.from(await image.arrayBuffer());
				const imageName = image.name.replaceAll(" ", "_");
				const filename = `${index}_${Date.now()}_${imageName}`;

				await fs.writeFile(path.join(filepath, filename), imageBuffer);

				// Setting the new imageUrl for the article
				const imageUrl = path.join("/images/articles", article.id, filename);

				// Update existing article image
				if (index < article.imagesUrl.length) {
					await db.articleImage.update({
						where: {
							id: article.imagesUrl[index].id,
						},
						data: {
							imageUrl,
						},
					});
					continue;
				}

				// Create new article image
				await db.articleImage.create({
					data: {
						articleId: article.id,
						imageUrl,
					},
				});
			}
		}

		return jsonResponse(article.id, 201);
	} catch (error) {
		// Handling internal error
		console.log("[ARTICLE_PATCH]", error);
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

		// Find the article by id and user id
		const article = await db.article.findFirst({
			where: {
				id: articleId,
				userId: authUser.id,
			},
			include: {
				imagesUrl: true,
			},
		});

		if (!article) {
			return jsonResponse("Article doesn't exist", 400);
		}

		// Delete associated images and article data
		for (const { id } of article.imagesUrl) {
			await db.articleImage.delete({
				where: {
					id,
				},
			});
		}

		// Removing article images dir
		const filepath = path.join(
			process.cwd(),
			"public/images/articles",
			articleId
		);
		await fs.rm(filepath, { recursive: true });

		// Deleting article
		await db.article.delete({
			where: {
				id: articleId,
				userId: authUser.id,
			},
		});

		return jsonResponse("Article deleted successfully", 200);
	} catch (error) {
		// Handling internal error
		console.log("[ARTICLE_DELETE]", error);
		return jsonResponse("Internal Error", 500);
	}
}
