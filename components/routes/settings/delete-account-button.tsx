"use client";

import { useModalStore } from "@/hooks/use-modal-store";

import { UserX } from "lucide-react";

export default function ChangePasswordButton() {
	const { onOpen } = useModalStore();

	return (
		<div
			className="flex gap-2 items-center w-full"
			onClick={() => onOpen("delete account")}
		>
			<UserX className="w-4 h-4" />

			<span>Delete account</span>
		</div>
	);
}
