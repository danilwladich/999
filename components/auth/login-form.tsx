"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { loginSchema as formSchema } from "@/app/api/auth/login/route";
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthMe } from "@/hooks/useAuthMe";

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
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			recaptchaToken: "",
		},
	});

	const recaptchaRef = useRef<ReCAPTCHA>(null);

	const [submitError, setSubmitError] = useState("");

	const isSubmitting = form.formState.isSubmitting;

	const searchParams = useSearchParams();
	const router = useRouter();

	const { setUser } = useAuthMe();

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setSubmitError("");

		try {
			const recaptchaToken = await recaptchaRef.current?.executeAsync();
			if (!recaptchaToken) {
				recaptchaRef.current?.reset();
				setSubmitError("Recaptcha error");
				return;
			}

			const res= await axios.post("/api/auth/login", {
				...values,
				recaptchaToken,
			});

			setUser(res.data)

			const redirectUrl = searchParams.get("from") || "/profile";
			router.replace(redirectUrl);
		} catch (e: unknown) {
			const error = e as AxiosError;

			recaptchaRef.current?.reset();

			const res = error?.response as AxiosResponse<
				{
					field: keyof z.infer<typeof formSchema>;
					message: string;
				},
				any
			>;

			if (!res) {
				alert(error.message);
				return;
			}

			// Validation, recaptcha or internal server error handler
			const fields = ["validation", "recaptchaToken", "internal"];
			if (fields.includes(res.data.field)) {
				setSubmitError(res.data.message);
				return;
			}

			form.setError(res.data.field, { message: res.data.message });
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="example@mail.com"
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
					Sing in
				</Button>
			</form>
		</Form>
	);
}
