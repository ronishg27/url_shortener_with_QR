import { redirect, useLoaderData } from "@remix-run/react";
// import { useEffect } from "react";
import { URLInfo } from "~/lib/interface";
import { getUrlDetails } from "~/utils/dbUtils";

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
	// useEffect(() => {}, [loaderData]);

	return (
		<div>
			<h1>Info about your shortened URL</h1>
			{loaderData.qrCodeSVG ? (
				<>
					<p>Original URL: {loaderData.redirectURL}</p>
					<p>Short ID: {loaderData.shortId}</p>
					{/* Displaying the QR Code (SVG format) */}
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
		</div>
	);
};

export default Info;
