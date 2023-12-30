import { Navigation } from "@/components/common/navigation";
import { Separator } from "@/components/ui/separator";

export function Header() {
	return (
		<header
			className="hidden md:block 
				fixed top-0 left-0 w-full 
				bg-[rgba(255,255,255,0.75)] dark:bg-[rgba(0,0,0,0.75)] 
				backdrop-blur-sm overflow-hidden z-50 "
		>
			<div className="flex items-center justify-between container">
				<h1 className="text-lg">999 | marketplace</h1>

				<Navigation />
			</div>

			<Separator />
		</header>
	);
}
