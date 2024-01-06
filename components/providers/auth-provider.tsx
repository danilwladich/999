"use client";

import { useLayoutEffect } from "react";

import { AppLoader } from "@/components/ui/app-loader";
import { useAuthMe } from "@/hooks/use-auth-me";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { isLoading, fetchUser } = useAuthMe();

	// useEffect to handle the authentication process
	useLayoutEffect(() => {
		fetchUser();
	}, []);

	// Displaying AppLoader while waiting for authentication to complete
	if (isLoading) {
		return <AppLoader />;
	}

	// Rendering children components once authentication is complete
	return children;
}
