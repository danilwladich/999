"use client";

import { useAuthStore } from "@/hooks/use-auth-store";
import { useModalStore } from "@/hooks/use-modal-store";
import ShareButton from "@/components/common/buttons/share-button";
import { FavoriteButton } from "./favorite-button";
import { DeleteButton } from "./delete-button";
import { getAppTitle } from "@/lib/get-app-title";
import type { Prisma } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil } from "lucide-react";

type Article = Prisma.ArticleGetPayload<{
	include: {
		favorites: true;
	};
}>;

export default function ArticleActions({
	id,
	title,
	userId,
	favorites,
}: Article) {
	const { user: authUser } = useAuthStore();
	const { onOpen } = useModalStore();

	const isOwner = userId === authUser?.id;

	const isFavorite = favorites.some((f) => f.userId === authUser?.id);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="">
					<MoreHorizontal className="w-6 h-6" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56" onClick={(e) => e.preventDefault()}>
				<DropdownMenuLabel>{title}</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<ShareButton url={`/article/${id}`} text={getAppTitle(title)} />

					{!isOwner && (
						<>
							<FavoriteButton isFavorite={isFavorite} id={id} />
						</>
					)}
				</DropdownMenuGroup>

				{isOwner && (
					<>
						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem onClick={() => onOpen("edit article")}>
								<Pencil className="mr-2 h-4 w-4" />
								<span>Edit article</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DeleteButton id={id} />
						</DropdownMenuGroup>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
