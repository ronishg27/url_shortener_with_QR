import axios from "axios";
import { redirect } from "react-router";
import URLModel from "~/model/url.model";
import { getUrlDetails } from "~/utils/dbUtils";

export const loader = async ({
	params,
	req,
}: {
	params: { shortId: string };
	req: Request;
}) => {
	// console.log(req?.headers);
	// Retrieve Client Info
	const clientIp = req?.headers.get("x-forwarded-for") || "unknown";
	const host = req?.headers.get("host") || "unknown";
	const referer = req?.headers.get("referer") || "No referer";
	const acceptLanguage = req?.headers.get("accept-language") || "unknown";

	// console.log("Client IP: ", clientIp);
	// console.log("Host: ", host);
	// console.log("Referer: ", referer);
	// console.log("Accept-Language: ", acceptLanguage);

	const userAgent = req?.headers.get("user-agent");
	const shortId = params.shortId;

	if (!shortId) {
		return new Response(JSON.stringify({ error: "shortId is required" }));
	}

	const urlInfo = await URLModel.findOne({ shortId });

	if (!urlInfo) {
		return new Response(JSON.stringify({ error: "url not found" }));
	}

	const { city, region, country, loc, org, timezone } = await getGeolocation(
		clientIp
	);

	urlInfo.visitHistory.push({
		timestamp: Date.now(),
		datestamp: new Date(),
		ip: String(clientIp),
		browser: getBrowserInfo(userAgent as string),
		referer: referer,
		host: host,
		acceptLanguage: acceptLanguage,
		isp: org,
		city,
		region,
		country,
		loc,
		timezone,
	});

	const data = await urlInfo.save();

	if (!data) {
		console.error("Failed to save visit history");
	}

	const fetchedDetail = await getUrlDetails(params.shortId);
	if (!fetchedDetail) return redirect("/");
	return redirect(fetchedDetail.redirectURL);
};

function getBrowserInfo(userAgent: string): string {
	if (userAgent?.includes("Chrome") && userAgent?.includes("Edg")) {
		return "Microsoft Edge";
	} else if (userAgent?.includes("Chrome")) {
		return "Google Chrome";
	} else if (userAgent?.includes("Firefox")) {
		return "Mozilla Firefox";
	} else if (userAgent?.includes("Safari") && !userAgent?.includes("Chrome")) {
		return "Safari";
	} else if (userAgent?.includes("OPR") || userAgent?.includes("Opera")) {
		return "Opera";
	} else if (userAgent?.includes("MSIE") || userAgent?.includes("Trident")) {
		return "Internet Explorer";
	} else {
		return "Unknown";
	}
}

async function getGeolocation(clientIp: string) {
	if (clientIp == "unknown") clientIp = "0.0.0.0";
	const resp = await axios.get(
		`https://ipinfo.io/${clientIp}?token=${process.env.IP_INFO_TOKEN || ""}`
	);
	// console.log(resp.data);
	return resp.data;
}
