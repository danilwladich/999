import { create } from "zustand";

type ModalType = "followers" | "followings" | "edit profile";

interface ModalStore {
	type: ModalType | null;
	isOpen: boolean;
	onOpen: (type: ModalType) => void;
	onClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
	type: null,
	isOpen: false,
	onOpen: (type: ModalType) => set({ type, isOpen: true }),
	onClose: () => set({ type: null, isOpen: false }),
}));