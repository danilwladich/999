"use client";

import axios, { AxiosError } from "axios";
import { useEffect, useState, createContext } from "react";
import { AppLoader } from "@/components/ui/app-loader";
import type { User } from '@prisma/client'

type UserType = User | {}

export const AuthContext = createContext<UserType>({});

export function AuthProvider({
	children,
	...props
}: {
	children: React.ReactNode;
}) {
	const [isLoading, setIsLoading] = useState(true);

	const [user, setUser] = useState<UserType>({});

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

	return (
		<AuthContext.Provider value={user} {...props}>
			{children}
		</AuthContext.Provider>
	);
}
