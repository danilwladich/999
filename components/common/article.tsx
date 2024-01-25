import Image from "next/image";
import Link from "next/link";
import { dateToShow } from "@/lib/date-to-show";
import type { Prisma } from "@prisma/client";

type Article = Prisma.ArticleGetPayload<{
	include: {
		imagesUrl: true;
	};
}>;

export function Article({
	id,
	title,
	imagesUrl,
	amount,
	currency,
	createdAt,
}: Article) {
	const imageSrc = imagesUrl[0].imageUrl;

	const date = dateToShow(createdAt);

	return (
		<article className="rounded-sm overflow-hidden">
			<Link href={`/article/${id}`} className="group">
				<div className="h-0 pb-[100%] md:pb-[75%] relative overflow-hidden">
					<Image
						src={imageSrc}
						alt={title}
						width={320}
						height={320}
						className="absolute top-0 left-0 w-full h-full object-cover 
							group-hover:scale-105 transition duration-300"
					/>
				</div>

				<p className="truncate mt-1">{title}</p>

				<div>
					<span className="text-xs md:text-sm">
						{amount > 0 ? `${amount} ${currency}` : "FREE"}
					</span>
				</div>

				<div>
					<time
						dateTime={createdAt.toString()}
						className="opacity-50 text-xs md:text-sm"
					>
						{date}
					</time>
				</div>
			</Link>
		</article>
	);
}
