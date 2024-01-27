import { useAlertDialogStore } from "@/hooks/use-alert-dialog-store";

import {
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function DeleteArticleAlertDialog() {
	const { onContinue } = useAlertDialogStore();

	return (
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

				<AlertDialogDescription>
					This action cannot be undone. This will permanently delete your
					article.
				</AlertDialogDescription>
			</AlertDialogHeader>

			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>

				<AlertDialogAction onClick={onContinue}>Continue</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	);
}
