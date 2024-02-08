"use client";

import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { editPasswordSchema as formSchema } from "@/lib/form-schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthMe } from "@/hooks/use-auth-me";
import { useModalStore } from "@/hooks/use-modal-store";
import { toast } from "sonner";
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

export default function EditPasswordForm() {
	// Setting up the form using react-hook-form with Zod resolver
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			oldPassword: "",
			newPassword: "",
			confirmNewPassword: "",
		},
	});

	// State for handling submit errors
	const [submitError, setSubmitError] = useState("");

	// Checking if the form is currently submitting
	const isSubmitting = form.formState.isSubmitting;

	const router = useRouter();

	const { onClose } = useModalStore();

	// Handler for form submission
	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Clearing any previous submit errors
		setSubmitError("");

		try {
			// Making a PATCH request to the user password API endpoint
			await axios.patch("/api/user/password", values);

			// Close the modal
			onClose();

			router.push("/auth");
		} catch (e: unknown) {
			// Handling AxiosError
			const error = e as AxiosError;

			// Extracting response from AxiosError
			const res = error?.response as ErrorResponse<typeof formSchema>;

			// Handling non-response errors
			if (!res) {
				toast.error("Edit password error", { description: error.message });
				return;
			}

			// Validation, recaptcha, or internal server error handler
			if (typeof res.data === "string") {
				setSubmitError(res.data);
				return;
			}

			// Setting form error for a specific field
			const { field, message } = res.data;
			form.setError(field, { message });
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 relative"
			>
				<FormField
					control={form.control}
					name="oldPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Old password</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="password"
									placeholder="Old password"
									disabled={isSubmitting}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="newPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>New password</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="password"
									autoComplete="new-password"
									placeholder="New password"
									disabled={isSubmitting}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="confirmNewPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm new password</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="password"
									autoComplete="new-password"
									placeholder="Confirm new password"
									disabled={isSubmitting}
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
