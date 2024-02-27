import Image from "next/image";
import type { ArticleImage } from "@prisma/client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export default function Images({
	images,
	title,
}: {
	images: ArticleImage[];
	title: string;
}) {
	return (
		<Carousel className="group">
			<CarouselContent>
				{images.map((image) => (
					<CarouselItem key={image.id}>
						<div className="h-0 pb-[100%] relative rounded-t-sm overflow-hidden">
							<Image
								src={image.imageUrl}
								alt={title}
								width={500}
								height={500}
								className="absolute top-0 left-0 w-full h-full object-cover"
							/>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className="left-2 !opacity-0 group-hover:disabled:!opacity-0 group-hover:!opacity-70 transition" />
			<CarouselNext className="right-2 !opacity-0 group-hover:disabled:!opacity-0 group-hover:!opacity-70 transition" />
		</Carousel>
	);
}
