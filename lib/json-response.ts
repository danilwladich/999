import { NextResponse } from "next/server";

export function jsonResponse(data: any, status: number, init?: ResponseInit) {
	return new NextResponse(JSON.stringify(data), {
		...init,
		status,
		headers: {
			"Content-Type": "application/json",
			...init?.headers,
		},
	});
}
