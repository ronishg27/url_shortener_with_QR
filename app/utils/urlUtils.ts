export const generateShortUrlFromShortId = (
	host: string,
	shortId: string
): string => {
	return `${host}/${shortId}`;
};

export const generateInfoUrl = (host: string, shortId: string): string => {
	return `${host}/info/${shortId}`;
};
