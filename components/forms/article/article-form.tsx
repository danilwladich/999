"use client";

import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { articleSchema as formSchema } from "@/lib/form-schema";
import { parseFormDataFromJson } from "@/lib/formdata-parser";
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ErrorResponse } from "@/types/ErrorResponse";
import ImagesField from "./images-field";
import { Currency } from "@prisma/client";

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
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";

export default function ArticleForm() {
	// Setting up the form using react-hook-form with Zod resolver
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			images: [],
			amount: "",
			currency: "USD",
			recaptchaToken: "",
		},
	});

	const recaptchaRef = useRef<ReCAPTCHA>(null);

	// State for handling submit errors
	const [submitError, setSubmitError] = useState("");

	// Checking if the form is currently submitting
	const isSubmitting = form.formState.isSubmitting;

	const router = useRouter();

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

			const formData = parseFormDataFromJson({
				...values,
				recaptchaToken,
			});

			// Making a POST request to the article API endpoint
			const res = await axios.post("/api/article", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			router.replace(`/article/${res.data}`);
		} catch (e: unknown) {
			// Handling AxiosError
			const error = e as AxiosError;

			// Resetting recaptcha
			recaptchaRef.current?.reset();

			// Extracting response from AxiosError
			const res = error?.response as ErrorResponse<typeof formSchema>;

			// Handling non-response errors
			if (!res) {
				toast.error("Article adding error", { description: error.message });
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
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Title" disabled={isSubmitting} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Description <span className="opacity-50 text-xs">optional</span>
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="Description"
									disabled={isSubmitting}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="images"
					render={({ field }) => (
						<ImagesField
							field={field}
							isSubmitting={isSubmitting}
							setError={(msg) =>
								form.setError("images", {
									message: msg,
								})
							}
							clearError={() => form.clearErrors("images")}
						/>
					)}
				/>

				<FormField
					control={form.control}
					name="amount"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="number"
									placeholder="4,90"
									disabled={isSubmitting}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="currency"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Currency</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="USD" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{Object.keys(Currency).map((currency) => (
										<SelectItem key={currency} value={currency}>
											{currency}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
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
					Save
				</Button>
			</form>
		</Form>
	);
}
