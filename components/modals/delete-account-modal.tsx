import DeleteAccountForm from "@/components/forms/settings/delete-account-form";

import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function DeleteAccountModal() {
	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Delete account</DialogTitle>
				<DialogDescription>
					This action cannot be undone. This will permanently delete your
					account
				</DialogDescription>
			</DialogHeader>

			<DeleteAccountForm />
		</DialogContent>
	);
}
