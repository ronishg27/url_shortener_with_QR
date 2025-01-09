import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
	{
		shortId: {
			type: String,
			required: true,
			unique: true,
		},
		redirectURL: {
			type: String,
			required: true,
		},
		qrCodeSVG: {
			type: String,
		},
		visitHistory: [
			{
				timestamp: {
					type: Number,
				},
				datestamp: {
					type: Date,
				},
				ip: {
					type: String,
					default: "unknown",
				},
				userAgent: {
					type: String,
					default: "unknown",
				},
				referer: {
					type: String,
					default: "unknown",
				},
				host: {
					type: String,
					default: "unknown",
				},
				acceptLanguage: {
					type: String,
					default: "unknown",
				},
				browser: {
					type: String,
					default: "unknown",
				},

				city: {
					type: String,
					default: "unknown",
				},

				region: {
					type: String,
					default: "unknown",
				},
				country: {
					type: String,
					default: "unknown",
				},
				loc: {
					type: String,
					default: "unknown",
				},
				isp: {
					type: String,
					default: "unknown",
				},
				timezone: {
					type: String,
					default: "unknown",
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

const URLModel = mongoose.models?.URL || mongoose.model("URL", urlSchema);

export default URLModel;
