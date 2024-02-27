import { db } from "@/lib/db";
import { getAppTitle } from "@/lib/get-app-title";
import type { Metadata } from "next";
import Images from "@/components/routes/article/images";
import Owner from "@/components/routes/article/owner";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ImageOff } from "lucide-react";

export async function generateMetadata({
	params,
}: {
	params: { id: string };
}): Promise<Metadata> {
	const article = await db.article.findFirst({
		where: {
			id: params.id,
		},
		select: {
			title: true,
		},
	});

	return {
		title: getAppTitle(article?.title || "Article not found"),
	};
}

export default async function Article({ params }: { params: { id: string } }) {
	const article = await db.article.findFirst({
		where: {
			id: params.id,
		},
		include: {
			images: true,
			user: true,
		},
	});

	if (!article) {
		return (
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<h2 className="text-xl">Article not found</h2>
			</div>
		);
	}

	const { title, description, images, user } = article;

	return (
		<div className="flex flex-col gap-4 pt-2 md:pt-0">
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>

				<CardContent>
					<div className="w-full max-w-[500px]">
						{!!images.length ? (
							<Images images={images} title={title} />
						) : (
							<div className="w-full h-0 pb-[50%] relative rounded-t-sm">
								<div
									className="absolute top-0 left-0 w-full h-full border border-dashed 
							flex flex-col justify-center items-center gap-2"
								>
									<ImageOff className="w-8 h-8" />
									<span>No images</span>
								</div>
							</div>
						)}
					</div>

					<CardDescription className="mt-4">{description}</CardDescription>
				</CardContent>
			</Card>

			<Card>
				<CardContent>
					<Owner {...user} />
				</CardContent>
			</Card>
		</div>
	);
}
