"use client";

import {
	useAlertDialogStore,
	AlertDialogType,
} from "@/hooks/use-alert-dialog-store";
import DeleteArticleAlertDialog from "../alert-dialogs/delete-article-alert-dialog";

import { AlertDialog } from "@/components/ui/alert-dialog";

const alertDialogsMap: { [key in AlertDialogType]: JSX.Element } = {
	"delete article": <DeleteArticleAlertDialog />,
};

export function AlertDialogProvider() {
	const { isOpen, type, onContinue, onClose } = useAlertDialogStore();

	if (!type || !isOpen || !onContinue) {
		return null;
	}

	return (
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			{alertDialogsMap[type]}
		</AlertDialog>
	);
}
