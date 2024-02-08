import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function getRandomTranslate(index: number) {
	if (Math.random() > 0.5) {
		return (8 - index) * 5;
	}

	return (8 - index) / 5;
}

export default function FollowingsLoader() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<Skeleton className="w-64 max-w-full h-6 mb-[2px]" />
				</CardTitle>
				<CardDescription>
					<Skeleton className="w-24 h-4" />
				</CardDescription>
			</CardHeader>

			<CardContent>
				{Array.from({ length: 8 }).map((_, i) => (
					<div
						key={`skeleton_user_${i}`}
						className="flex gap-2 items-center mb-2 last:mb-0"
					>
						<Skeleton className="rounded-full w-12 h-12" />

						<div className="flex-1 overflow-hidden">
							<Skeleton
								className="w-36 h-5 mb-[2px]"
								style={{
									transform: `translate(-${getRandomTranslate(i)}px, 0)`,
								}}
							/>
						</div>

						<Skeleton className="w-10 h-10" />
					</div>
				))}
			</CardContent>
		</Card>
	);
}
