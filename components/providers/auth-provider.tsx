"use client";

import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { AppLoader } from "@/components/ui/app-loader";
import { useAuthMe } from "@/hooks/useAuthMe";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isLoading, setIsLoading] = useState(true);

	const { setUser } = useAuthMe();

	useEffect(() => {
		async function authMe() {
			setIsLoading(true);

			try {
				const res = await axios.get("/api/auth/me");

				setUser(res.data);
			} catch (e: unknown) {
				const error = e as AxiosError;

				if (!error.response) {
					alert(error.message);
				}
			}

			setIsLoading(false);
		}

		authMe();
	}, []);

	if (isLoading) {
		return <AppLoader />;
	}

	return children;
}
