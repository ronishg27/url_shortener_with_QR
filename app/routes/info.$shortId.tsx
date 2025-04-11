import { Link, redirect, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { URLInfo } from "~/lib/interface";
import { getUrlDetails } from "~/utils/dbUtils";
import { generateShortUrlFromShortId } from "~/utils/urlUtils";

export const loader = async ({ params }: { params: { shortId: string } }) => {
	const urlDetails = await getUrlDetails(params.shortId);

	if (!urlDetails) return redirect("/");
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
		<div className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-400 p-6 flex items-center justify-center">
			<Card className="w-full max-w-2xl bg-white/90 backdrop-blur shadow-xl">
				<CardHeader className="text-center border-b pb-6">
					<h1 className="text-2xl font-bold text-primary">URL Statistics</h1>
					<p className="text-slate-600 mt-2">
						Detailed information about your shortened URL
					</p>
				</CardHeader>

				<CardContent className="p-6">
					{loaderData.qrCodeSVG ? (
						<div className="space-y-8">
							<div className="grid md:grid-cols-2 gap-6">
								<div className="space-y-6">
									<div>
										<h2 className="text-lg font-semibold mb-4">
											URL Information
										</h2>
										<div className="space-y-4">
											<div>
												<p className="text-sm text-slate-600">Original URL</p>
												<Link
													to={loaderData.redirectURL}
													className="text-primary hover:underline break-all"
													target="_blank"
													rel="noreferrer">
													{loaderData.redirectURL}
												</Link>
											</div>

											<div>
												<p className="text-sm text-slate-600">Short ID</p>
												<p className="font-medium">{loaderData.shortId}</p>
											</div>

											<div>
												<p className="text-sm text-slate-600">Short URL</p>
												<Link
													to={`/${loaderData.shortId}`}
													className="text-primary hover:underline break-all">
													{generateShortUrlFromShortId(
														hostname,
														loaderData.shortId
													)}
												</Link>
											</div>

											<div>
												<p className="text-sm text-slate-600">Total Clicks</p>
												<p className="text-2xl font-bold text-primary">
													{loaderData.visitHistory.length}
												</p>
											</div>
										</div>
									</div>
								</div>

								<div className="space-y-4">
									<h2 className="text-lg font-semibold">QR Code</h2>
									<div className="bg-white rounded-lg p-4 shadow-sm max-w-[240px] mx-auto">
										<div
											dangerouslySetInnerHTML={{
												__html: loaderData.qrCodeSVG,
											}}
										/>
									</div>
									<p className="text-sm text-center text-slate-600">
										Scan to access the shortened URL
									</p>
								</div>
							</div>
							<AnalyticsSection visitHistory={loaderData.visitHistory} />
						</div>
					) : (
						<div className="p-12 text-center">
							<div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
							<p className="text-slate-600 mt-4">Loading...</p>
						</div>
					)}
				</CardContent>

				<div className="border-t p-6 text-center">
					<Link to="/" className="text-primary hover:underline">
						← Back to URL Shortener
					</Link>
				</div>
			</Card>
		</div>
	);
};

type Visit = {
	browser: string;
	country: string;
	timestamp: number;
	datestamp: Date;
	ip: string;
	referer: string;
	host: string;
	acceptLanguage: string;
	isp: string;
	city: string;
	region: string;
	loc: string;
	timezone: string;
};

type AnalyticsCount = {
	[key: string]: number;
};

const AnalyticsSection = ({ visitHistory }: { visitHistory: Visit[] }) => {
	return (
		<div className="mt-8 space-y-6">
			<h2 className="text-lg font-semibold">Analytics</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-white p-4 rounded-lg shadow-sm">
					<h3 className="text-sm text-slate-600">Top Browsers</h3>
					<div className="mt-2">
						{Object.entries(
							visitHistory.reduce<AnalyticsCount>((acc, visit) => {
								acc[visit.browser] = (acc[visit.browser] || 0) + 1;
								return acc;
							}, {})
						).map(([browser, count]) => (
							<div key={browser} className="flex justify-between">
								<span>{browser}</span>
								<span className="font-medium">{String(count)}</span>
							</div>
						))}
					</div>
				</div>

				<div className="bg-white p-4 rounded-lg shadow-sm">
					<h3 className="text-sm text-slate-600">Top Countries</h3>
					<div className="mt-2">
						{Object.entries(
							visitHistory.reduce<AnalyticsCount>((acc, visit) => {
								acc[visit.country] = (acc[visit.country] || 0) + 1;
								return acc;
							}, {})
						).map(([country, count]) => (
							<div key={country} className="flex justify-between">
								<span>{country}</span>
								<span className="font-medium">{String(count)}</span>
							</div>
						))}
					</div>
				</div>

				<div className="bg-white p-4 rounded-lg shadow-sm">
					<h3 className="text-sm text-slate-600">Recent Visits</h3>
					<div className="mt-2 space-y-2">
						{visitHistory
							.slice(-5)
							.reverse()
							.map((visit, index) => (
								<div key={index} className="text-sm">
									{new Date(visit.timestamp).toLocaleDateString()}
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Info;
