"use client";

import { useModalStore } from "@/hooks/use-modal-store";
import FollowersModal from "@/components/modals/followers-modal";
import FollowingsModal from "@/components/modals/followings-modal";
import EditProfileModal from "@/components/modals/edit-profile-modal";

import { Dialog } from "@/components/ui/dialog";

const modalsMap = {
	followers: <FollowersModal />,
	followings: <FollowingsModal />,
	"edit profile": <EditProfileModal />,
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
