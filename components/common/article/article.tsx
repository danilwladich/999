import Image from "next/image";
import Link from "next/link";
import ArticleActions from "./actions/actions";
import { dateToShow } from "@/lib/date-to-show";
import type { Prisma } from "@prisma/client";

type Article = Prisma.ArticleGetPayload<{
	include: {
		imagesUrl: true;
		favorites: true;
	};
}>;

export function Article(props: Article) {
	const { id, title, imagesUrl, amount, currency, createdAt } = props;

	const imageSrc = imagesUrl[0].imageUrl;

	const date = dateToShow(createdAt);

	return (
		<article>
			<Link href={`/article/${id}`} className="group">
				<div className="h-0 pb-[100%] md:pb-[75%] relative rounded-t-sm overflow-hidden">
					<Image
						src={imageSrc}
						alt={title}
						width={320}
						height={320}
						className="absolute top-0 left-0 w-full h-full object-cover 
							group-hover:scale-105 transition duration-300"
					/>
				</div>

				<div className="flex justify-between relative mt-1">
					<div className="overflow-hidden flex-1">
						<p className="truncate">{title}</p>

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
					</div>

					<ArticleActions {...props} />
				</div>
			</Link>
		</article>
	);
}