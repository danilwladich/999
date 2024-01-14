import { useTheme } from "next-themes";

export function useUserImageSrc(imageUrl?: string) {
	const { resolvedTheme } = useTheme();

	const imageSrc =
		imageUrl || resolvedTheme === "dark"
			? "/images/common/user-dark.jpg"
			: "/images/common/user-light.jpg";

	return imageSrc;
}
