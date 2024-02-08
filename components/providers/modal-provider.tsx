"use client";

import { useModalStore, ModalType } from "@/hooks/use-modal-store";
import EditUsernameModal from "@/components/modals/edit-username-modal";
import EditAvatarModal from "@/components/modals/edit-avatar-modal";

import { Dialog } from "@/components/ui/dialog";

const modalsMap: { [key in ModalType]: JSX.Element } = {
	"edit username": <EditUsernameModal />,
	"edit avatar": <EditAvatarModal />,
	"edit article": <></>, // TODO
};

export function ModalProvider() {
	const { isOpen, type, onClose } = useModalStore();

	if (!type || !isOpen) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			{modalsMap[type]}
		</Dialog>
	);
}
