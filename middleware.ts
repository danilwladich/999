import { NextRequest, NextResponse } from "next/server";
import { authValidation } from "@/lib/auth-validation";

function authRedirect(req: NextRequest) {
	const loginUrl = new URL("/auth", req.url);
	loginUrl.searchParams.set("from", req.nextUrl.pathname);

	return NextResponse.redirect(loginUrl);
}

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
		const redirectUrl = new URL(
			fromUrl || `/profile/${authUser.username}`,
			req.url
		);

		return NextResponse.redirect(redirectUrl);
	}

	if (req.nextUrl.pathname.startsWith("/profile")) {
		// Extract the searched user from the URL
		const searchedUser: string | undefined = req.nextUrl.pathname.split("/")[2];

		// Allow the request to proceed if searched user was provided
		if (searchedUser) {
			return NextResponse.next();
		}

		// Checking authentication status
		const authUser = await authValidation();

		// If authenticated but searched user not provided, redirect to the auth user profile
		if (authUser) {
			const userProfileUrl = new URL(`/profile/${authUser.username}`, req.url);
			return NextResponse.redirect(userProfileUrl);
		}

		// If not authenticated and searched user not provided, redirect to the login page and store the original URL
		return authRedirect(req);
	}

	if (req.nextUrl.pathname.startsWith("/followers")) {
		// Extract the searched user from the URL
		const searchedUser: string | undefined = req.nextUrl.pathname.split("/")[2];

		// Allow the request to proceed if searched user was provided
		if (searchedUser) {
			return NextResponse.next();
		}

		// Checking authentication status
		const authUser = await authValidation();

		// If authenticated but searched user not provided, redirect to the auth user followers page
		if (authUser) {
			const userFollowersUrl = new URL(
				`/followers/${authUser.username}`,
				req.url
			);
			return NextResponse.redirect(userFollowersUrl);
		}

		// If not authenticated and searched user not provided, redirect to the login page and store the original URL
		return authRedirect(req);
	}

	if (req.nextUrl.pathname.startsWith("/followings")) {
		// Extract the searched user from the URL
		const searchedUser: string | undefined = req.nextUrl.pathname.split("/")[2];

		// Allow the request to proceed if searched user was provided
		if (searchedUser) {
			return NextResponse.next();
		}

		// Checking authentication status
		const authUser = await authValidation();

		// If authenticated but searched user not provided, redirect to the auth user followings page
		if (authUser) {
			const userFollowingsUrl = new URL(
				`/followings/${authUser.username}`,
				req.url
			);
			return NextResponse.redirect(userFollowingsUrl);
		}

		// If not authenticated and searched user not provided, redirect to the login page and store the original URL
		return authRedirect(req);
	}

	const protectedPath = ["/adding"];

	if (protectedPath.some((path) => req.nextUrl.pathname.startsWith(path))) {
		// Checking authentication status
		const authUser = await authValidation();

		// If authenticated but searched user not provided, redirect to the auth user followings page
		if (authUser) {
			return NextResponse.next();
		}

		// If not authenticated and searched user not provided, redirect to the login page and store the original URL
		return authRedirect(req);
	}
}

// Configuration for the middleware, specifying the routes to apply the middleware to
export const config = {
	matcher: [
		"/auth",
		"/profile/:path?",
		"/followers/:path?",
		"/followings/:path?",
		"/adding",
		"/api/auth/me",
		"/api/user/:path*",
		"/api/article/:path?",
	],
};
