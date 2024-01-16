export function useBlobToData(blob: Blob): Promise<string> {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.readAsDataURL(blob);
	});
}
