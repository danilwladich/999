"use client";

import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { deleteAccountSchema as formSchema } from "@/lib/form-schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/use-auth-store";
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
			password: "",
			confirmPassword: "",
		},
	});

	// State for handling submit errors
	const [submitError, setSubmitError] = useState("");

	// Checking if the form is currently submitting
	const isSubmitting = form.formState.isSubmitting;

	const router = useRouter();

	const { onClose } = useModalStore();
	const { setUser } = useAuthStore();

	// Handler for form submission
	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Clearing any previous submit errors
		setSubmitError("");

		try {
			// Making a DELETE request to the user account API endpoint
			await axios.delete("/api/user/account", { data: values });

			// Close the modal
			onClose();

			setUser(null);

			router.push("/auth");
		} catch (e: unknown) {
			// Handling AxiosError
			const error = e as AxiosError;

			// Extracting response from AxiosError
			const res = error?.response as ErrorResponse<typeof formSchema>;

			// Handling non-response errors
			if (!res) {
				toast.error("Delete account error", { description: error.message });
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
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="password"
									placeholder="Password"
									disabled={isSubmitting}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm password</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="password"
									placeholder="Confirm password"
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

				<Button type="submit" variant="destructive" disabled={isSubmitting}>
					Delete
				</Button>
			</form>
		</Form>
	);
}
