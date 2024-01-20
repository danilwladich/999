import { MAX_FILES_COUNT, ACCEPTED_IMAGE_TYPES } from "@/lib/form-schema";
import { useState } from "react";
import Image from "next/image";
import type { ControllerRenderProps } from "react-hook-form";

import {
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImagePlus, Trash2 } from "lucide-react";

export default function ImagesField({
	field,
	isSubmitting,
	setError,
	clearError,
}: {
	field: ControllerRenderProps<any, "images">;
	isSubmitting: boolean;
	setError: (msg: string) => void;
	clearError: () => void;
}) {
	const [selectedImages, setSelectedImages] = useState<File[]>([]);

	function handleImageUpload(files: FileList | null) {
		clearError();

		const images = Array.from(files || []);

		let newImages = [...selectedImages, ...images];

		if (newImages.length > MAX_FILES_COUNT) {
			newImages = newImages.slice(0, MAX_FILES_COUNT);
			setError(`You cannot upload more than ${MAX_FILES_COUNT} images.`);
		}

		setSelectedImages(newImages);
		field.onChange(newImages);
	}

	function handleImageRemove(index: number) {
		clearError();

		const newImages = [...selectedImages].filter((_, i) => i !== index);

		setSelectedImages(newImages);
		field.onChange(newImages);
	}

	return (
		<FormItem className="overflow-auto">
			<FormLabel className="grid gap-2 grid-cols-5 w-[800px] md:w-full">
				{selectedImages.map((image, index) => (
					<div
						key={`${index}_${image.name}}`}
						className="relative h-0 pb-[100%]"
						onClick={(e) => e.preventDefault()}
					>
						{index === 0 && (
							<span className="bg-cyan-500 px-1 absolute top-0 right-0 opacity-75 z-10">
								main
							</span>
						)}

						<Image
							src={URL.createObjectURL(image)}
							alt={image.name}
							width={260}
							height={260}
							className="absolute object-cover w-full h-full top-0 left-0"
						/>

						<div
							className="absolute left-0 top-0 w-full h-full flex justify-center items-center
								z-20 opacity-0 hover:opacity-100 duration-150"
						>
							<Trash2
								className="w-12 h-12 z-10 p-2 cursor-pointer"
								onClick={() => {
									handleImageRemove(index);
								}}
							/>
							<div className="absolute left-0 top-0 w-full h-full bg-white dark:bg-black opacity-50" />
						</div>
					</div>
				))}

				{Array.from({
					length: MAX_FILES_COUNT - selectedImages.length,
				}).map((_, index) => (
					<div
						key={`not_selected_${index}`}
						className="relative border border-dashed h-0 pb-[100%]"
					>
						{!selectedImages.length && index === 0 && (
							<span className="bg-cyan-500 px-1 absolute top-0 right-0 opacity-75">
								main
							</span>
						)}

						<div className="absolute w-full h-full top-0 left-0 flex flex-col justify-center items-center gap-2">
							<ImagePlus className="w-8 h-8" />
							<p>Select image</p>
						</div>
					</div>
				))}
			</FormLabel>
			<FormControl>
				<Input
					{...field}
					onChange={(e) => {
						handleImageUpload(e.target.files);
					}}
					value=""
					type="file"
					multiple
					accept={ACCEPTED_IMAGE_TYPES.join(", ")}
					disabled={isSubmitting}
					className="hidden"
				/>
			</FormControl>
			<FormMessage />
		</FormItem>
	);
}
