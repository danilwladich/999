import EditPasswordForm from "@/components/forms/settings/edit-password-form";

import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function EditPasswordModal() {
	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Edit password</DialogTitle>
				<DialogDescription>
					Change your password. After saving, you'll be logged out
				</DialogDescription>
			</DialogHeader>

			<EditPasswordForm />
		</DialogContent>
	);
}
