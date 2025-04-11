import { type MetaFunction, data } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import URLModel from "~/model/url.model";
import QRCode from "qrcode";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { generateShortUrlFromShortId } from "~/utils/urlUtils";
import { Checkbox } from "~/components/ui/checkbox";
import { Keywords } from "~/utils/constant.js";
import { URLInfo } from "~/lib/interface";

export const meta: MetaFunction = () => {
	return [
		{ title: "Shorten It" },
		{ name: "description", content: "Shorten It, a URL shortener." },
	];
};

export const action = async ({ request }: { request: Request }) => {
	const formData = await request.formData();
	const url = formData.get("redirectURL") as string;
	let shortId = formData.get("customId") as string;
	const hostname = formData.get("host") as string;

	if (!url) {
		return new Response(JSON.stringify({ error: "URL is required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		new URL(url); // Validate the URL format
	} catch {
		return new Response(JSON.stringify({ error: "Invalid URL format." }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	if (!shortId) {
		shortId = nanoid(8).toLowerCase();
	} else {
		shortId = shortId.toLowerCase();
		if (Keywords.includes(shortId))
			return new Response(
				JSON.stringify({ error: "Cannot use that string as custom ID." }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);

		const idPattern = /^[a-zA-Z0-9_-]{1,20}$/;
		if (!idPattern.test(shortId)) {
			return new Response(
				JSON.stringify({
					error: "Custom ID must be alphanumeric and under 20 characters.",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}
	}

	try {
		const existingEntry = await URLModel.findOne({ shortId });
		if (existingEntry) {
			return new Response(
				JSON.stringify({
					error: "Custom ID already exists. Please choose a different one.",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}

		// console.log(url);
		const shortUrl = `${hostname}/${shortId}`;
		const qrCodeSVG = await QRCode.toString(shortUrl, { type: "svg" });
		const createdURL = await URLModel.create({
			redirectURL: url,
			shortId,
			qrCodeSVG,
		});

		return data({ createdURL }, { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error saving URL:", error.message);
		} else {
			console.error("Error saving URL:", error);
		}
		return new Response(JSON.stringify({ error: "Failed to shorten URL" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};

export default function Index() {
	const [isCustomUrl, setIsCustomUrl] = useState(false);
	const [hostname, setHostname] = useState("");
	const [actionData, setActionData] = useState<URLInfo>();
	const [loading, setLoading] = useState(false);

	const dataFromAction = useActionData<{
		error?: string;
		createdURL?: { _doc: URLInfo };
	}>();

	useEffect(() => {
		setHostname(window.location.origin);
	}, [hostname]);
	useEffect(() => {
		setActionData(dataFromAction?.createdURL?._doc);
		if (actionData) {
			setLoading(false);
		}
	}, [dataFromAction, actionData]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center p-4">
			<Card className="w-full max-w-md bg-white/90 backdrop-blur shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
				<CardHeader className="bg-primary text-primary-foreground p-6 border-b">
					<CardTitle className="text-2xl font-bold text-center">
						Shorten It
					</CardTitle>
					<p className="text-center text-sm opacity-90 mt-2">
						Create short, memorable links in seconds
					</p>
				</CardHeader>

				<CardContent className="mx-auto p-6">
					<Form method="post" className="space-y-6">
						<div className="flex flex-col">
							<label htmlFor="redirectURL" className="text-lg font-medium mb-2">
								Enter your long URL
							</label>
							<input
								type="url"
								name="redirectURL"
								id="redirectURL"
								className="w-full bg-slate-50 py-2 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
								placeholder="https://example.com/your-long-url"
								required
							/>
						</div>

						<div className="flex items-center gap-3 mb-4">
							<Checkbox
								onCheckedChange={() => setIsCustomUrl(!isCustomUrl)}
								name="customUrl"
								id="customUrl"
								className="h-5 w-5"
							/>
							<label htmlFor="customUrl" className="text-sm font-medium">
								Use custom URL
							</label>
						</div>

						{isCustomUrl && (
							<div className="flex flex-col space-y-2">
								<label htmlFor="customId" className="text-lg font-medium">
									Custom URL path
								</label>
								<input
									type="text"
									name="customId"
									id="customId"
									className="w-full bg-slate-50 py-2 px-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
									placeholder="my-custom-url"
								/>
							</div>
						)}

						<input
							type="text"
							name="host"
							id="host"
							hidden
							value={hostname}
							readOnly
						/>

						<Button
							type="submit"
							className="w-full py-3 text-lg font-semibold transition-all duration-200 hover:scale-[1.02]"
							disabled={loading}>
							{loading ? (
								<span className="flex items-center justify-center gap-2">
									<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
											fill="none"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
										/>
									</svg>
									Shortening...
								</span>
							) : (
								"Shorten URL"
							)}
						</Button>
					</Form>
				</CardContent>

				<CardFooter className="flex flex-col gap-4 p-6 bg-slate-50">
					{dataFromAction?.error && (
						<div className="w-full p-3 rounded-lg bg-red-50 border border-red-200 text-red-600">
							{dataFromAction.error}
						</div>
					)}

					{actionData && (
						<div className="w-full space-y-4 bg-green-50 p-4 rounded-lg border border-green-200">
							<div className="space-y-2">
								<h3 className="font-semibold text-green-800">
									URL Successfully Shortened!
								</h3>
								<div className="flex flex-col gap-2">
									<div>
										<p className="text-sm text-slate-600">Original URL:</p>
										<p className="text-sm font-medium truncate">
											{actionData.redirectURL}
										</p>
									</div>

									<div>
										<p className="text-sm text-slate-600">Short URL:</p>
										<Link
											to={`/${actionData.shortId}`}
											className="text-primary hover:underline font-medium break-all">
											{generateShortUrlFromShortId(
												hostname,
												actionData.shortId
											)}
										</Link>
									</div>
								</div>
							</div>

							<div className="flex flex-col items-center gap-2">
								<p className="font-medium">QR Code</p>
								<div className="w-32 p-2 bg-white rounded-lg shadow-sm">
									<div
										dangerouslySetInnerHTML={{ __html: actionData.qrCodeSVG }}
									/>
								</div>
							</div>

							<Link
								to={`/info/${actionData.shortId}`}
								className="block text-center text-sm text-primary hover:underline">
								View Statistics →
							</Link>
						</div>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
