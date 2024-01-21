import { db } from "@/lib/db";
import type { NextRequest } from "next/server";
import { articleSchema } from "@/lib/form-schema";
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
			return jsonResponse(
				{
					field: "validation",
					message: "Validation Error",
				},
				400
			);
		}

		const { title, description, images, amount, currency, recaptchaToken } =
			body.data;

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

			// Create dir if not exists
			try {
				await fs.access(filepath);
			} catch {
				await fs.mkdir(filepath, { recursive: true });
			}

			for (const [index, image] of images.entries()) {
				// Reading and save the new avatar image
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
