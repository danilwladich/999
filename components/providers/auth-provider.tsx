"use client";

import { useClientFetching } from "@/hooks/use-client-fetching";
import { useAuthStore } from "@/hooks/use-auth-store";
import type { UserWithoutPassword } from "@/types/UserWithoutPassword";

import { AppLoader } from "@/components/ui/app-loader";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { data, isLoading, error } = useClientFetching<UserWithoutPassword>(
		"/api/auth/me",
		{ errorRetryCount: 0 }
	);

	const { isChecked, setUser } = useAuthStore();

	if (isLoading && !isChecked) {
		return <AppLoader />;
	}

	if (!error && data) {
		setUser(data);
	}

	return children;
}
