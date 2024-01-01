import { NextRequest, NextResponse } from "next/server";
import { authValidation } from "@/lib/auth-validation";

export async function middleware(req: NextRequest) {
	// Switch statement to determine the route and apply authentication logic
	switch (req.nextUrl.pathname) {
		case "/api": {
			// Checking authentication status
			const authUser = await authValidation();

			// If authenticated, allow the request to proceed
			if (authUser) {
				return NextResponse.next();
			}

			// If not authenticated, return an Unauthorized response
			return new NextResponse("Unauthorized", { status: 401 });
		}

		case "/auth": {
			// Checking authentication status
			const authUser = await authValidation();

			// If not authenticated, allow the request to proceed
			if (!authUser) {
				return NextResponse.next();
			}

			// If authenticated, redirect to the specified URL or default to "/profile"
			const fromUrl = req.nextUrl.searchParams.get("from");
			const redirectUrl = new URL(fromUrl || "/profile", req.url);

			return NextResponse.redirect(redirectUrl);
		}

		case "/profile": {
			// Checking authentication status
			const authUser = await authValidation();

			// If authenticated, allow the request to proceed
			if (authUser) {
				return NextResponse.next();
			}

			// If not authenticated, redirect to the login page and store the original URL
			const loginUrl = new URL("/auth", req.url);
			loginUrl.searchParams.set("from", req.nextUrl.pathname);

			return NextResponse.redirect(loginUrl);
		}

		default:
			break;
	}
}

// Configuration for the middleware, specifying the routes to apply the middleware to
export const config = {
	matcher: ["/auth", "/profile"],
};
