import { redirect } from "@remix-run/node";

// In a real app, you'd want to use proper authentication
// This is just a simple example using environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "ron";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "20202";

export async function requireAuth(request: Request) {
	const url = new URL(request.url);
	const cookieHeader = request.headers.get("Cookie");
	const authCookie = cookieHeader
		?.split(";")
		.find((c) => c.trim().startsWith("auth="))
		?.split("=")[1];

	if (!authCookie) {
		throw redirect(`/login?redirectTo=${url.pathname}`);
	}

	try {
		const [username, password] = atob(authCookie).split(":");

		if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
			throw redirect(`/login?redirectTo=${url.pathname}`);
		}

		return { username };
	} catch (error) {
		throw redirect(`/login?redirectTo=${url.pathname}`);
	}
}
