import { create } from "zustand";
import type { UserWithoutPassword } from "@/types/UserWithoutPassword";

type UserType = UserWithoutPassword | null;

interface AuthStore {
	user: UserType;
	isChecked: boolean;
	setUser: (user: UserType) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	user: null,
	isChecked: false,
	setUser: (user) => set({ user, isChecked: true }),
}));
