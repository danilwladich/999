import { create } from "zustand";
import { UserWithoutPassword } from "@/types/UserWithoutPassword";
import axios, { AxiosError } from "axios";

type UserType = UserWithoutPassword | null;

interface AuthStore {
	isLoading: boolean;
	user: UserType;
	fetchUser: () => Promise<void>;
}

export const useAuthMe = create<AuthStore>((set) => ({
	isLoading: true,
	user: null,
	fetchUser: async () => {
		set({ isLoading: true });

		try {
			// Making a GET request to the authentication endpoint
			const res = await axios.get("/api/auth/me");

			// Setting the authenticated user
			set({ user: res.data });
		} catch (e: unknown) {
			// Handling AxiosError
			const error = e as AxiosError;

			// Handling non-response errors
			if (!error.response) {
				alert(error.message);
			}
		}

		set({ isLoading: false });
	},
}));
