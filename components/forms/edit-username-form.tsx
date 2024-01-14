"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { editUsernameSchema as formSchema } from "@/app/api/user/username/route";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthMe } from "@/hooks/use-auth-me";
import { useModalStore } from "@/hooks/use-modal-store";
import { toast } from "sonner";

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

export default function EditUsernameForm() {
	// Setting up the form using react-hook-form with Zod resolver
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
		},
	});

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
			// Making a PATCH request to the user username API endpoint
			const res = await axios.patch("/api/user/username", values);

			setUser(res.data);

			onClose();

			router.push(`/profile/${values.username}`);
		} catch (e: unknown) {
			// Handling AxiosError
			const error = e as AxiosError;

			// Extracting response from AxiosError
			const res = error?.response as AxiosResponse<
				{
					field: keyof z.infer<typeof formSchema>;
					message: string;
				},
				any
			>;

			// Handling non-response errors
			if (!res) {
				toast.error("Edit username error", { description: error.message });
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
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 relative"
			>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder={authUser?.username || "Username"}
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
