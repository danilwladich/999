import { create } from "zustand";
import { UserWithoutPassword } from "@/types/UserWithoutPassword";

type UserType = UserWithoutPassword | null;

interface AuthStore {
	user: UserType;
	setUser: (user: UserType) => void;
}

export const useAuthMe = create<AuthStore>((set) => ({
	user: null,
	setUser: (user) => set({ user }),
}));
