import { create } from "zustand";
import type { User } from "@prisma/client";

type UserType = User | null;

interface AuthStore {
	user: UserType;
	setUser: (user: UserType) => void;
}

export const useAuthMe = create<AuthStore>((set) => ({
	user: null,
	setUser: (user) => set({ user }),
}));
