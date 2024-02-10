"use client";

import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/hooks/use-auth-store";

import { AppLoader } from "@/components/ui/app-loader";
import { toast } from "sonner";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isLoading, setIsLoading] = useState(true);

	const { setUser } = useAuthStore();

	// useEffect to handle the authentication process
	useEffect(() => {
		async function authMe() {
			setIsLoading(true);

			try {
				// Making a GET request to the authentication endpoint
				const res = await axios.get("/api/auth/me");

				// Setting the authenticated user
				setUser(res.data);
			} catch (e: unknown) {
				// Handling AxiosError
				const error = e as AxiosError;

				setUser(null);

				// Handling non-response errors
				if (!error.response) {
					toast.error("Auth me error", { description: error.message });
				}
			}

			// Setting loading status to false
			setIsLoading(false);
		}

		// Calling the authMe function when the component mounts
		authMe();
	}, [setUser]);

	// Displaying AppLoader while waiting for authentication to complete
	if (isLoading) {
		return <AppLoader />;
	}

	// Rendering children components once authentication is complete
	return children;
}


