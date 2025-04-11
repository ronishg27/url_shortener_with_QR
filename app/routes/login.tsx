import { ActionFunction } from "@remix-run/node";
import { Form, useSearchParams, useActionData } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const username = formData.get("username");
	const password = formData.get("password");
	const redirectTo = formData.get("redirectTo") as string;

	// In a real app, you'd want to use proper authentication
	const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "ron";
	const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "20202";

	if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
		// console.log("Matched");
		const credentials = btoa(`${username}:${password}`);
		const headers = new Headers();
		headers.set("Location", redirectTo || "/url-dashboard");
		headers.set(
			"Set-Cookie",
			`auth=${credentials}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
		);
		return new Response(null, { status: 302, headers });
	}

	return { error: "Invalid username or password" };
};

export default function Login() {
	const [searchParams] = useSearchParams();
	const actionData = useActionData<{ error?: string }>();
	const redirectTo = searchParams.get("redirectTo") || "/url-dashboard";

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center p-4">
			<Card className="w-full max-w-md bg-white/90 backdrop-blur shadow-xl">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
				</CardHeader>
				<CardContent>
					{actionData?.error && (
						<div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
							{actionData.error}
						</div>
					)}
					<Form method="post" className="space-y-4">
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium mb-1">
								Username
							</label>
							<input
								type="text"
								name="username"
								id="username"
								className="w-full px-3 py-2 border rounded-md"
								required
							/>
						</div>
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium mb-1">
								Password
							</label>
							<input
								type="password"
								name="password"
								id="password"
								className="w-full px-3 py-2 border rounded-md"
								required
							/>
						</div>
						<input type="hidden" name="redirectTo" value={redirectTo} />
						<Button type="submit" className="w-full">
							Login
						</Button>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
