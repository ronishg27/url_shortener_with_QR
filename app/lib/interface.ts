export interface URLInfo {
	shortId: string;
	redirectURL: string;
	qrCodeSVG: string;
	createdAt: string;
	visitHistory: VisitHistory[];
	_id: string;
	__v: number;
}

export interface VisitHistory {
	timestamp: number;
	datestamp: Date;
	ip: string;
	browser: string;
	referer: string;
	acceptLanguage: string;
	isp: string;
	region: string;
	_id: string;
	city: string;
	loc: string;
	host: string;
	country: string;
	timezone: string;
}
