"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { useAuthStore } from "@/hooks/use-auth-store";
import StarsButton from "@/components/routes/settings/stars-button";
import LogOutButton from "@/components/common/buttons/log-out-button";
import ChangePasswordButton from "@/components/routes/settings/change-password-button";
import DeleteAccountButton from "@/components/routes/settings/delete-account-button";

import { Card, CardContent } from "@/components/ui/card";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";

export default function Settings() {
	const { user: authUser } = useAuthStore();

	return (
		<Card className="md:w-[500px] md:mx-auto">
			<CardContent>
				<Command>
					<CommandInput placeholder="Search..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>

						<CommandGroup heading="General">
							<CommandItem>
								<ModeToggle />
							</CommandItem>
							<CommandItem>
								<StarsButton />
							</CommandItem>
						</CommandGroup>

						{!!authUser && (
							<>
								<CommandSeparator />

								<CommandGroup heading="Profile">
									<CommandItem>
										<LogOutButton />
									</CommandItem>

									<CommandItem>
										<ChangePasswordButton />
									</CommandItem>

									<CommandItem>
										<DeleteAccountButton />
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</CardContent>
		</Card>
	);
}
