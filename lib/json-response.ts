import { NextResponse } from "next/server";

export function jsonResponse(
	data: string | Object,
	status: number,
	init?: ResponseInit
) {
	const responseData = typeof data == "string" ? data : JSON.stringify(data);
	return new NextResponse(responseData, {
		...init,
		status,
		headers: {
			"Content-Type": "application/json",
			...init?.headers,
		},
	});
}
