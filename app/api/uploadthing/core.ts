import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

async function handleAuth() {
	const auth = () => ({ id: "fakeId" });

	const user = await auth();

	if (!user) {
		throw new Error("Unauthorized");
	}

	return { userId: user.id };
}

export const ourFileRouter = {
	serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
	messageFile: f(["image", "pdf"])
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
