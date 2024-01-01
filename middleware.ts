import { NextRequest, NextResponse } from "next/server";
import { authValidation } from "@/lib/auth-validation";

export async function middleware(req: NextRequest) {
	if (req.nextUrl.pathname.startsWith("/api")) {
		// Checking authentication status
		const authUser = await authValidation();

		// If user is authenticated
		if (authUser) {
			const reqHeaders = new Headers(req.headers);

			// Adding header with the authenticated user data
			reqHeaders.set("x-auth-user", JSON.stringify(authUser));

			// Allowing the request to proceed with the updated headers
			return NextResponse.next({
				request: {
					headers: reqHeaders,
				},
			});
		}

		// If not authenticated, return an Unauthorized response
		return new NextResponse("Unauthorized", { status: 401 });
	}

	if (req.nextUrl.pathname.startsWith("/auth")) {
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

	if (req.nextUrl.pathname.startsWith("/profile")) {
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
}

// Configuration for the middleware, specifying the routes to apply the middleware to
export const config = {
	matcher: ["/auth", "/profile"],
};
