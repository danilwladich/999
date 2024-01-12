import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function EditProfileModal() {
	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader className="overflow-hidden">
				<DialogTitle className="truncate">Edit profile</DialogTitle>
				<DialogDescription>Make changes to your profile here</DialogDescription>
			</DialogHeader>
			content
		</DialogContent>
	);
}
