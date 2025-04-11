import URLModel from "~/model/url.model";

export const getUrlDetails = async (shortId: string) => {
	try {
		const entry = await URLModel.findOne({ shortId });
		if (!entry) {
			console.log("No URL found for given Short ID.");
		}
		// console.log("entry: ", entry);
		return entry;
	} catch (error) {
		console.error("Error fetching the url: ", error);
		return null;
	}
};

export const getAllUrls = async () => {
	try {
		const response = await URLModel.find();
		if (!response) throw new Error("Error fetching url.");
		// console.log("Response from utils:", response);
		return response;
	} catch (error) {
		console.log("Error fetching url details: ", error);
		// return null;
	}
};

export const deleteAllUrls = async () => {
	try {
		const response = await URLModel.deleteMany();
		return response;
	} catch (error) {
		console.error("Error deleting Data ::", error);
	}
};

export const deleteOneUrl = async (shortId: string) => {
	try {
		const deletedUrl = await URLModel.findOneAndDelete({ shortId });
		if (!deletedUrl) {
			console.log(`No URL found for shortId: ${shortId}`);
			return null;
		}
		console.log(`Deleted URL: ${shortId}`);
		return deletedUrl;
	} catch (error) {
		console.error("Error deleting URL ::", error);
		throw error;
	}
};
