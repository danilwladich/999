import { authValidation } from "@/lib/auth-validation";

export default async function Profile() {
	const authUser = await authValidation();

	if (!authUser) {
		return null;
	}

	return <div>{authUser.username}</div>;
}
