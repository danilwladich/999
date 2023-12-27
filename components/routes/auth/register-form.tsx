"use client";

import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { registerSchema as formSchema } from "@/app/api/auth/register/route";
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

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

export default function Register() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
			recaptchaToken: "",
		},
	});

	const recaptchaRef = useRef<ReCAPTCHA>(null);

	const [submitError, setSubmitError] = useState("");

	const isSubmitting = form.formState.isSubmitting;

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setSubmitError("");

		try {
			const recaptchaToken = await recaptchaRef.current?.executeAsync();
			if (!recaptchaToken) {
				recaptchaRef.current?.reset();
				setSubmitError("Recaptcha error");
				return;
			}

			const res = await axios.post("/api/auth/register", {
				...values,
				recaptchaToken,
			});
		} catch (e: unknown) {
			const error = e as AxiosError;

			recaptchaRef.current?.reset();

			if (!error.response) {
				alert(error.message);
				return;
			}

			setSubmitError(error.response!.data as string);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input
									disabled={isSubmitting}
									placeholder="username"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									disabled={isSubmitting}
									placeholder="example@mail.com"
									{...field}
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
									disabled={isSubmitting}
									type="password"
									placeholder="password"
									{...field}
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
									disabled={isSubmitting}
									type="password"
									placeholder="confirm password"
									{...field}
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
					Sing up
				</Button>
			</form>
		</Form>
	);
}
