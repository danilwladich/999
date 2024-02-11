import { Navigation } from "@/components/common/navigation";
import { Separator } from "@/components/ui/separator";

export function Footer() {
	return (
		<footer
			className="block md:hidden 
				fixed bottom-0 left-0 w-full 
				bg-[rgba(255,255,255,0.75)] dark:bg-[rgba(0,0,0,0.75)] 
				backdrop-blur-sm overflow-hidden z-50 "
		>
			<Separator />

			<div className="mr-[var(--removed-body-scroll-bar-size)]">
				<Navigation />
			</div>
		</footer>
	);
}
