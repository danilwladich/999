"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { loginSchema as formSchema } from "@/app/api/auth/login/route";
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthMe } from "@/hooks/use-auth-me";

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

export default function Login() {
	// Setting up the form using react-hook-form with Zod resolver
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			emailOrUsername: "",
			password: "",
			recaptchaToken: "",
		},
	});

	const recaptchaRef = useRef<ReCAPTCHA>(null);

	// State for handling submit errors
	const [submitError, setSubmitError] = useState("");

	// Checking if the form is currently submitting
	const isSubmitting = form.formState.isSubmitting;

	// Accessing query parameters from the URL
	const searchParams = useSearchParams();
	const router = useRouter();

	const { setUser } = useAuthMe();

	// Handler for form submission
	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Clearing any previous submit errors
		setSubmitError("");

		try {
			// Executing recaptcha to get the token
			const recaptchaToken = await recaptchaRef.current?.executeAsync();

			// Handling recaptcha errors
			if (!recaptchaToken) {
				recaptchaRef.current?.reset();
				setSubmitError("Recaptcha error");
				return;
			}

			// Making a POST request to the login API endpoint
			const res = await axios.post("/api/auth/login", {
				...values,
				recaptchaToken,
			});

			// Setting the authenticated user and redirecting
			setUser(res.data);

			const redirectUrl =
				searchParams.get("from") || `/profile/${res.data.username}`;
			router.replace(redirectUrl);
		} catch (e: unknown) {
			// Handling AxiosError
			const error = e as AxiosError;

			// Resetting recaptcha
			recaptchaRef.current?.reset();

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
				alert(error.message);
				return;
			}

			// Validation, recaptcha, or internal server error handler
			const fields = ["validation", "recaptchaToken", "internal"];
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
					name="emailOrUsername"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email or username</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="example@mail.com | username"
									disabled={isSubmitting}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

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
									placeholder="password"
									disabled={isSubmitting}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<ReCAPTCHA
					className="absolute"
					ref={recaptchaRef}
					size="invisible"
					sitekey="6LcwYyQkAAAAAMsq2VnRYkkqNqLt-ljuy-gfmPYn"
				/>

				{!!submitError && (
					<p className="text-sm font-medium text-destructive text-center">
						{submitError}
					</p>
				)}

				<Button type="submit" disabled={isSubmitting}>
					Sign in
				</Button>
			</form>
		</Form>
	);
}
