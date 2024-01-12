"use client";

import { useModalStore } from "@/hooks/use-modal-store";

import { Dialog } from "@/components/ui/dialog";
import FollowersModal from "@/components/modals/followers-modal";
import FollowingsModal from "@/components/modals/followings-modal";

const modalsMap = {
	followers: <FollowersModal />,
	followings: <FollowingsModal />,
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
