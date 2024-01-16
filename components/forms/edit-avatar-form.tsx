"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { editAvatarSchema as formSchema } from "@/app/api/user/avatar/route";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthMe } from "@/hooks/use-auth-me";
import { useUserImageSrc } from "@/hooks/use-user-image-src";
import { toast } from "sonner";
import { useModalStore } from "@/hooks/use-modal-store";
import { parseFormDataFromJson } from "@/lib/formdata-parser";
import { ErrorResponse } from "@/types/ErrorResponse";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function EditAvatarForm() {
	// Setting up the form using react-hook-form with Zod resolver
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			image: undefined,
		},
	});

	const [selectedImage, setSelectedImage] = useState<File>();

	// State for handling submit errors
	const [submitError, setSubmitError] = useState("");

	// Checking if the form is currently submitting
	const isSubmitting = form.formState.isSubmitting;

	const router = useRouter();
	const { user: authUser, setUser } = useAuthMe();
	const { onClose } = useModalStore();

	// Handler for form submission
	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Clearing any previous submit errors
		setSubmitError("");

		try {
			const formData = parseFormDataFromJson(values);

			// Making a PATCH request to the user avatar API endpoint
			const res = await axios.patch("/api/user/avatar", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			// Updating the user state with the new avatar
			setUser(res.data);

			// Close the modal
			onClose();

			router.refresh();
		} catch (e: unknown) {
			// Handling AxiosError
			const error = e as AxiosError;

			// Extracting response from AxiosError
			const res = error?.response as ErrorResponse<typeof formSchema>;

			// Handling non-response errors
			if (!res) {
				toast.error("Edit avatar error", { description: error.message });
				return;
			}

			// Validation, recaptcha, or internal server error handler
			const fields = ["validation", "internal"];
			if (fields.includes(res.data.field)) {
				setSubmitError(res.data.message);
				return;
			}

			// Setting form error for specific field
			form.setError(res.data.field, { message: res.data.message });
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="image"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="flex justify-center mt-4">
								<Avatar className="w-24 h-24 cursor-pointer">
									<AvatarImage
										src={
											selectedImage
												? URL.createObjectURL(selectedImage)
												: useUserImageSrc(authUser?.imageUrl)
										}
										alt={authUser?.username || "not auth"}
									/>
									<AvatarFallback>
										{authUser?.username[0] || "not auth"}
									</AvatarFallback>
								</Avatar>
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									onChange={(e) => {
										const image = e.target.files?.[0] || undefined;
										setSelectedImage(image);
										field.onChange(image);
									}}
									value=""
									type="file"
									accept="image/png, image/jpeg"
									disabled={isSubmitting}
									className="hidden"
									ref={field.ref}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{!!submitError && (
					<p className="text-sm font-medium text-destructive text-center">
						{submitError}
					</p>
				)}

				<Button type="submit" disabled={isSubmitting}>
					Save
				</Button>
			</form>
		</Form>
	);
}
