"use client";

import { Share, Copy, CopyCheck } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function ShareButton({ username }: { username: string }) {
	const [isCopied, setIsCopied] = useState(false);

	// Checking if the browser supports the Web Share API
	const isAbleToShare = !!navigator.share;

	const url = `${window.location.origin}/profile/${username}`;

	async function onShare(e: React.MouseEvent<HTMLDivElement>) {
		e.preventDefault();

		try {
			await navigator.share({ url });
		} catch (err) {
			console.log("Sharing failed:", err);
		}
	}

	async function onCopy(e: React.MouseEvent<HTMLDivElement>) {
		e.preventDefault();

		if (isCopied) {
			return;
		}

		try {
			await navigator.clipboard.writeText(url);

			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 1000);
		} catch (err) {
			console.log("Coping failed:", err);
		}
	}

	if (!isAbleToShare) {
		return (
			<DropdownMenuItem onClick={onCopy}>
				{isCopied ? (
					<CopyCheck className="mr-2 h-4 w-4" />
				) : (
					<Copy className="mr-2 h-4 w-4" />
				)}
				<span>{isCopied ? "Link copied" : "Copy link"}</span>
			</DropdownMenuItem>
		);
	}

	return (
		<DropdownMenuItem onClick={onShare}>
			<Share className="mr-2 h-4 w-4" />
			<span>Share</span>
		</DropdownMenuItem>
	);
}
