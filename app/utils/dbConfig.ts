import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";
const connectDB = async () => {
	// Check if already connected to avoid multiple connections in development
	if (mongoose.connection.readyState >= 1) {
		return;
	}
	try {
		const connectInstance = await mongoose.connect(
			`${process.env.MONGODB_URI}/${DB_NAME}`
		);
		console.log(`MongoDB Connected: ${connectInstance.connection.host}`);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(`MongoDB connection failed. Error: ${error.message}`);
		} else {
			console.error("MongoDB connection failed with an unknown error.");
		}
		process.exit(1);
	}
};

export default connectDB;
