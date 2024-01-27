import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoader() {
	return (
		<div className="flex flex-col gap-4 pt-2 md:pt-0">
			<Card>
				<CardContent>
					<div className="flex flex-col md:flex-row gap-4 justify-between items-center">
						<div className="w-full flex flex-row gap-2 md:gap-4 items-center overflow-hidden">
							<Skeleton className="w-20 md:w-24 h-20 md:h-24 rounded-full" />

							<Skeleton className="h-5 my-1 w-40" />
						</div>

						<div className="flex gap-2 items-center w-full">
							<Skeleton className="h-10 flex-1" />
							<Skeleton className="h-10 flex-1" />

							<Skeleton className="h-10 w-10" />
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={`skeleton_article_${i}`} className="rounded-sm">
							<Skeleton className="w-full h-0 pb-[100%] md:pb-[75%]" />

							<div className="flex justify-between mt-[6px] gap-1">
								<div className="w-48 max-w-full">
									<Skeleton className="w-full h-5 mb-[2px]" />

									<Skeleton className="w-14 h-5 my-1" />

									<Skeleton className="w-24 h-5 mt-1 mb-[2px]" />
								</div>

								<div className="w-10">
									<Skeleton className="w-10 h-10" />
								</div>
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
