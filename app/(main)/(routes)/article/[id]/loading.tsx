import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

						<Skeleton className="w-10 h-10" />
					</div>
				))}
			</CardContent>
		</Card>
	);
}
