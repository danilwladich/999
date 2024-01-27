"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useAlertDialogStore } from "@/hooks/use-alert-dialog-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Trash2 } from "lucide-react";

export function DeleteButton({ id }: { id: string }) {
	const [isLoading, setIsLoading] = useState(false);

	const { onOpen, onClose } = useAlertDialogStore();

	const router = useRouter();

	async function onDelete(e: React.MouseEvent<HTMLDivElement>) {
		e.preventDefault();

		setIsLoading(true);
		onClose();

		try {
			// Making a DELETE request to the article favorite API endpoint
			await axios.delete("/api/article", {
				data: { articleId: id },
			});

			// Refresh page to get new article data
			router.refresh();
		} catch (e: unknown) {
			// Handling AxiosError
			const error = e as AxiosError;

			// Extracting response from AxiosError
			const res = error?.response as AxiosResponse<string, any>;

			// Handling non-response errors
			if (!res) {
				toast.error("Article delete error", { description: error.message });
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
			onClick={() => onOpen("delete article", onDelete)}
		>
			<Trash2 className="mr-2 h-4 w-4" />

			<span>Delete</span>
		</DropdownMenuItem>
	);
}
