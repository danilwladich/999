import * as z from "zod";

import { Currency } from "@prisma/client";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const MAX_FILE_SIZE_STRING = "5MB";
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
];
const ACCEPTED_IMAGE_TYPES_STRING = ".jpg, .jpeg, .png and .webp";

export const loginSchema = z.object({
	emailOrUsername: z
		.string()
		.min(4, { message: "This field must be at least 4 characters." }),
	password: z.string().min(6, {
		message: "Password must be at least 6 characters.",
	}),
	recaptchaToken: z.string(),
});

export const registerSchema = z
	.object({
		username: z
			.string()
			.trim()
			.regex(/^\w+$/g, "Username must be alphanumeric.")
			.min(4, {
				message: "Username must be at least 4 characters.",
			})
			.max(16, { message: "Username must be less than 16 characters." }),
		email: z.string().trim().email("This is not a valid email."),
		password: z
			.string()
			.trim()
			.min(6, {
				message: "Password must be at least 6 characters.",
			})
			.regex(/[A-Z]/g, "Password must contain at least 1 uppercase letter.")
			.regex(/[a-z]/g, "Password must contain at least 1 lowercase letter.")
			.regex(/[0-9]/g, "Password must contain at least 1 digit.")
			.refine((value) => !/\s/.test(value), {
				message: "Password cannot contain whitespaces.",
			}),
		confirmPassword: z.string().trim().min(1, {
			message: "This field has to be filled.",
		}),
		recaptchaToken: z.string(),
	})
	.refine(
		// Additional refinement to check if passwords match in client
		(data) => data.password === data.confirmPassword,
		{
			message: "Passwords don't match.",
			path: ["confirmPassword"],
		}
	);

export const editUsernameSchema = z.object({
	username: z
		.string()
		.trim()
		.regex(/^\w+$/g, "Username must be alphanumeric.")
		.min(4, {
			message: "Username must be at least 4 characters.",
		})
		.max(16, { message: "Username must be less than 16 characters." }),
});

export const editAvatarSchema = z.object({
	image: z
		.any()
		.refine((file?: File) => !!file, "No image provided.")
		.refine(
			(file: File) => file.size <= MAX_FILE_SIZE,
			`Max image size is ${MAX_FILE_SIZE_STRING}.`
		)
		.refine(
			(file: File) => ACCEPTED_IMAGE_TYPES.includes(file.type),
			`Only ${ACCEPTED_IMAGE_TYPES_STRING} formats are supported.`
		),
});

export const articleSchema = z.object({
	title: z
		.string()
		.min(4, { message: "Title must be at least 4 characters." })
		.max(40, { message: "Title must be less than 40 characters." }),
	description: z
		.string()
		.max(400, { message: "Description must be less than 400 characters." })
		.optional(),
	images: z
		.any()
		.refine(
			(files?: File[]) => (files?.length ? files.length <= 10 : true),
			"Maximum number of images must be at less than 10"
		)
		.refine(
			(files?: File[]) => files?.every((file) => file.size <= MAX_FILE_SIZE),
			`Max image size is ${MAX_FILE_SIZE_STRING}.`
		)
		.refine(
			(files?: File[]) =>
				files?.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
			`Only ${ACCEPTED_IMAGE_TYPES_STRING} formats are supported.`
		),
	amount: z
		.number()
		.min(1, { message: "This field has to be filled." })
		.max(999999999, { message: "Too expensive." }),
	currency: z.nativeEnum(Currency),
	recaptchaToken: z.string(),
});