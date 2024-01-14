"use client";

import { useModalStore } from "@/hooks/use-modal-store";
import FollowersModal from "@/components/modals/followers-modal";
import FollowingsModal from "@/components/modals/followings-modal";
import EditUsernameModal from "@/components/modals/edit-username-modal";
import EditAvatarModal from "@/components/modals/edit-avatar-modal";

import { Dialog } from "@/components/ui/dialog";

const modalsMap = {
	followers: <FollowersModal />,
	followings: <FollowingsModal />,
	"edit username": <EditUsernameModal />,
	"edit avatar": <EditAvatarModal />,
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
