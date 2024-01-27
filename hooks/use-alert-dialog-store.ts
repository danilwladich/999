import { create } from "zustand";

export type AlertDialogType = "delete article";

interface AlertDialogStore {
	type: AlertDialogType | null;
	isOpen: boolean;
	onContinue: any;
	onOpen: (type: AlertDialogType, onContinue: any) => void;
	onClose: () => void;
}

export const useAlertDialogStore = create<AlertDialogStore>((set) => ({
	type: null,
	isOpen: false,
	onContinue: null,
	onOpen: (type: AlertDialogType, onContinue: any) =>
		set({ type, onContinue, isOpen: true }),
	onClose: () => set({ type: null, onContinue: null, isOpen: false }),
}));
