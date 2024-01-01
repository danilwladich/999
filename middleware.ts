import { NextRequest, NextResponse } from "next/server";
import { authValidation } from "@/lib/auth-validation";

export async function middleware(req: NextRequest) {
	switch (req.nextUrl.pathname) {
		case "/api": {
			const authUser = await authValidation();

			if (authUser) {
				return NextResponse.next();
			}

			return new NextResponse("Unauthorized", { status: 401 });
		}

		case "/auth": {
			const authUser = await authValidation();

			if (!authUser) {
				return NextResponse.next();
			}

			const fromUrl = req.nextUrl.searchParams.get("from");
			const redirectUrl = new URL(fromUrl || "/profile", req.url);

			return NextResponse.redirect(redirectUrl);
		}

		case "/profile": {
			const authUser = await authValidation();

			if (authUser) {
				return NextResponse.next();
			}

			const loginUrl = new URL("/auth", req.url);
			loginUrl.searchParams.set("from", req.nextUrl.pathname);

			return NextResponse.redirect(loginUrl);
		}

		default:
			break;
	}
}

export const config = {
	matcher: ["/auth", "/profile"],
};
