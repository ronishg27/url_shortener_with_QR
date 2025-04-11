import { redirect } from "@remix-run/node";

// In a real app, you'd want to use proper authentication
// This is just a simple example using environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function requireAuth(request: Request) {
	const url = new URL(request.url);
	const authHeader = request.headers.get("Authorization");

	if (!authHeader) {
		throw redirect(`/login?redirectTo=${url.pathname}`);
	}

	const [type, credentials] = authHeader.split(" ");
	if (type !== "Basic") {
		throw redirect(`/login?redirectTo=${url.pathname}`);
	}

	const [username, password] = atob(credentials).split(":");

	if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
		throw redirect(`/login?redirectTo=${url.pathname}`);
	}

	return { username };
}
