"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Heart } from "lucide-react";

export function FavoriteButton({
	isFavorite,
	id,
}: {
	isFavorite: boolean;
	id: string;
}) {
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	async function onFavorite(
		e: React.MouseEvent<HTMLDivElement>,
		isFavorite: boolean
	) {
		e.preventDefault();

		setIsLoading(true);

		try {
			if (isFavorite) {
				// Making a DELETE request to the article favorite API endpoint
				await axios.delete("/api/article/favorite", {
					data: { articleId: id },
				});
			} else {
				// Making a POST request to the article favorite API endpoint
				await axios.post("/api/article/favorite", { articleId: id });
			}

			// Refresh page to get new article data
			router.refresh();
		} catch (e: unknown) {
			// Handling AxiosError
			const error = e as AxiosError;

			// Extracting response from AxiosError
			const res = error?.response as AxiosResponse<string, any>;

			// Handling non-response errors
			if (!res) {
				toast.error("Article favorite error", { description: error.message });
				return;
			}

			if (res.status === 401) {
				router.push(`/auth?from=/article/${id}`);
			}
		}

		setIsLoading(false);
	}

	return (
		<DropdownMenuItem
			disabled={isLoading}
			onClick={(e) => onFavorite(e, isFavorite)}
		>
			<Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />

			<span>{isFavorite ? "Unfollow" : "Follow"}</span>
		</DropdownMenuItem>
	);
}
