import { Link, redirect, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
// import { useEffect } from "react";
import { URLInfo } from "~/lib/interface";
import { getUrlDetails } from "~/utils/dbUtils";
import { generateInfoUrl, generateShortUrlFromShortId } from "~/utils/urlUtils";

export const loader = async ({ params }: { params: { shortId: string } }) => {
	const urlDetails = await getUrlDetails(params.shortId);
	if (!urlDetails) return redirect("/");
	// console.log("Url details :", urlDetails);
	return new Response(JSON.stringify(urlDetails), {
		headers: { "Content-Type": "application/json" },
	});
};

const Info = () => {
	const loaderData = useLoaderData<URLInfo>();
	const [hostname, setHostname] = useState("");
	useEffect(() => {
		setHostname(window.location.hostname);
	}, [loaderData]);

	return (
		<div className="flex flex-col flex-wrap  items-center">
			<Card className="w-[500px] justify-center">
				<CardHeader className="font-semibold text-2xl text-center">
					Info about your shortened URL
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					{loaderData.qrCodeSVG ? (
						<>
							<p>
								<span className="font-bold">Original URL: </span>
								<Link to={`/${loaderData.shortId}`}>
									<span className="underline">{loaderData.redirectURL}</span>
								</Link>
							</p>
							<p>
								<span className="font-bold">Short ID: </span>
								<span>{loaderData.shortId}</span>
							</p>
							<p>
								<span className="font-bold">Short URL: </span>
								<Link to={`/${loaderData.shortId}`}>
									<span className="underline">
										{generateShortUrlFromShortId(hostname, loaderData.shortId)}
									</span>
								</Link>
							</p>
							<p>
								<span className="font-bold">Info URL: </span>
								<Link to={`/info/${loaderData.shortId}`}>
									<span className="underline">
										{generateInfoUrl(hostname, loaderData.shortId)}
									</span>
								</Link>
							</p>

							<p>
								<span className="font-bold">Number of Clicks: </span>
								<span>{loaderData.visitHistory.length}</span>
							</p>
							{/* Displaying the QR Code (SVG format) */}
							<p>
								<span className="font-bold">QR for the URL: </span>
							</p>
							<div
								className="w-40"
								dangerouslySetInnerHTML={{
									__html: loaderData.qrCodeSVG,
								}}
							/>
						</>
					) : (
						<p>Loading...</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default Info;
