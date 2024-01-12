"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";

import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function LogOutButton() {
	const router = useRouter();

	async function onLogOut() {
		try {
			await axios.delete("/api/auth/me");

			router.push("/auth");
		} catch (e: unknown) {
			// Handling AxiosError
			const error = e as AxiosError;

			// Extracting response from AxiosError
			const res = error?.response as AxiosResponse<string, any>;

			// Handling non-response errors
			if (!res) {
				alert(error.message);
				return;
			}
		}
	}

	return (
		<DropdownMenuItem onClick={onLogOut}>
			<LogOut className="mr-2 h-4 w-4" />
			<span>Log out</span>
		</DropdownMenuItem>
	);
}
