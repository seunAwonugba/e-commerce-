import mongoose from "mongoose";
import { dbUri } from "./env";

export const connectDb = async () => {
    try {
        await mongoose.connect(dbUri);
        console.log(
            "⚡️[payment-database]: Database connection has been established successfully",
        );
    } catch (error) {
        console.log("😥 [payment-database]", error);
    }
};

export default mongoose;
