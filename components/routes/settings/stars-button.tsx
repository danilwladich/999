"use client";

import Link from "next/link";
import { useClientFetching } from "@/hooks/use-client-fetching";

import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StarsButton() {
	const { data, isLoading } = useClientFetching<any[]>(
		"https://api.github.com/repos/danilwladich/999/stargazers"
	);

	const starsCount = data?.length;

	if (isLoading) {
		return (
			<Link href="https://github.com/danilwladich/999" className="w-full">
				<Skeleton className="w-full h-5" />
			</Link>
		);
	}

	return (
		<Link
			href="https://github.com/danilwladich/999"
			className="flex gap-2 items-center w-full"
		>
			<div className="flex gap-1 items-center">
				<Star className="w-4 h-4" />

				<span>{starsCount}</span>
			</div>

			<span className="flex-1">Leave a star</span>
		</Link>
	);
}
