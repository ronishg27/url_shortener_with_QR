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
// import { URLInfo } from "~/lib/interface";
import { generateInfoUrl, generateShortUrlFromShortId } from "~/utils/urlUtils";
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
	// console.log("data from action:", dataFromAction);
	// const dataFromAction = useActionData<typeof action>();

	// console.log("URL: ", actionData.createdURL);
	useEffect(() => {
		setHostname(window.location.origin);
	}, [hostname]);
	useEffect(() => {
		setActionData(dataFromAction?.createdURL?._doc);
		if (actionData) {
			setLoading(false);
			// console.log("Action data found");
		}
		// console.log(actionData);
	}, [dataFromAction, actionData]);

	return (
		<div className="min-h-screen bg-slate-300 flex items-center justify-center p-4">
			<Card className="w-full max-w-md bg-slate-200 shadow-lg rounded-lg overflow-hidden">
				<CardHeader className="bg-primary text-primary-foreground p-6">
					<CardTitle className="text-2xl font-bold justify">
						Shorten It URL Shortener
					</CardTitle>
				</CardHeader>

				<CardContent className="mx-auto ">
					<Form method="post" className="space-y-6">
						<div className="flex flex-col mt-10">
							<label
								htmlFor="redirectURL"
								className="text-lg font-semibold mb-1.5 ">
								Enter a URL to shorten:
							</label>
							<input
								type="url"
								name="redirectURL"
								id="redirectURL"
								className="w-full bg-slate-100  py-0.5 rounded-sm px-2  text-gray-900 shadow-sm border-primary ring ring-primary focus:ring-opacity-900"
								placeholder="https://example.com"
								required
							/>
						</div>
						{/* Conditional Custom URL Input */}
						<div
							style={{ display: isCustomUrl ? "block" : "none" }}
							className="flex flex-col">
							<label htmlFor="customId" className="text-lg font-semibold  ">
								Enter a custom ID:
							</label>
							<input
								type="text"
								name="customId"
								id="customId"
								className="w-full rounded-sm mt-1.5 px-2 py-0.5 bg-slate-100 text-gray-900 shadow-sm border-primary ring ring-primary focus:ring-opacity-50"
							/>
						</div>
						{/* Custom URL Checkbox */}
						<div className="flex items-center gap-3">
							<label
								htmlFor="customUrl"
								className="text-sm text-gray-600 dark:text-gray-300">
								Custom URL?
							</label>
							<Checkbox
								onCheckedChange={() => setIsCustomUrl(!isCustomUrl)}
								name="customUrl"
								id="customUrl"
								className="h-5 w-5"
							/>
							{/* <input
								type="checkbox"
								name="customUrl"
								id="customUrl"
								
							/> */}
						</div>
						{/* Error Message (if any) */}

						<input
							type="text"
							name="host"
							id="host"
							hidden
							value={hostname}
							readOnly
						/>

						{/* Submit Button */}
						<div className="flex justify-center">
							<Button
								type="submit"
								className="w-full p-3 mx-auto"
								disabled={loading}
								onSubmit={(e) => {
									e.preventDefault();
									// setIsFetched(true);
									setLoading(true);
								}}>
								Shorten URL
							</Button>
						</div>
					</Form>
				</CardContent>
				<CardFooter>
					{dataFromAction?.error && (
						<p className="text-red-500 text-sm">{dataFromAction?.error}</p>
					)}
					{actionData && (
						<div className=" flex flex-col gap-[8]">
							<span className="font-bold">Original URL: </span>
							{actionData?.redirectURL}
							<span className="font-bold">Short URL: </span>
							<span className="underline">
								<Link to={`/${actionData.shortId}`}>
									{generateShortUrlFromShortId(
										hostname,
										actionData.shortId as string
									)}
								</Link>
							</span>
							<span className="font-bold">URL Info: </span>
							<span className="underline">
								<Link to={`/info/${actionData.shortId}`}>
									{generateInfoUrl(hostname, actionData.shortId as string)}
								</Link>
							</span>
							<span className="font-bold">QR Code:</span>
							<div
								className="w-40 mx-auto"
								dangerouslySetInnerHTML={{
									__html: actionData.qrCodeSVG,
								}}
							/>
						</div>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
