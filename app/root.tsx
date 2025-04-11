import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useRouteError,
	Link,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { ThemeProvider } from "~/utils/theme-provider";

import "./tailwind.css";

export const links: LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<ThemeProvider>
			<Outlet />
		</ThemeProvider>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();

	return (
		<html lang="en">
			<head>
				<title>Oops!</title>
				<Meta />
				<Links />
			</head>
			<body>
				<div className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center p-4">
					<div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
						<h1 className="text-3xl font-bold text-red-600 mb-4">
							{isRouteErrorResponse(error) ? error.status : "Error"}
						</h1>
						<p className="text-slate-600 mb-6">
							{isRouteErrorResponse(error)
								? error.data
								: "Something went wrong. Please try again later."}
						</p>
						<Link to="/" className="text-primary hover:underline">
							Return to Home
						</Link>
					</div>
				</div>
				<Scripts />
			</body>
		</html>
	);
}

export const meta = () => {
	return [
		{ title: "Shorten It - URL Shortener" },
		{
			name: "description",
			content:
				"Create short, memorable links with advanced analytics and QR codes.",
		},
		{ property: "og:type", content: "website" },
		{ property: "og:title", content: "Shorten It - URL Shortener" },
		{
			property: "og:description",
			content:
				"Create short, memorable links with advanced analytics and QR codes.",
		},
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: "Shorten It - URL Shortener" },
		{
			name: "twitter:description",
			content:
				"Create short, memorable links with advanced analytics and QR codes.",
		},
	];
};
