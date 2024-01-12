import type { UserWithoutPassword } from "@/types/UserWithoutPassword";
import { NextRequest } from "next/server";

export function getAuthUser(req: NextRequest): UserWithoutPassword {
	return JSON.parse(req.headers.get("x-auth-user") || "");
}
