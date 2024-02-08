"use client";

import { useModalStore } from "@/hooks/use-modal-store";

import { KeyRound } from "lucide-react";

export default function ChangePasswordButton() {
	const { onOpen } = useModalStore();

	return (
		<div
			className="flex gap-2 items-center w-full"
			onClick={() => onOpen("edit password")}
		>
			<KeyRound className="w-4 h-4" />

			<span>Edit password</span>
		</div>
	);
}
