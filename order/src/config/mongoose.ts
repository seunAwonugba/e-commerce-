import mongoose from "mongoose";
import { dbUri } from "./env";

export const connectDb = async () => {
    try {
        await mongoose.connect(dbUri);
        console.log(
            "⚡️[order-database]: Database connection has been established successfully",
        );
    } catch (error) {
        console.log("😥 [order-database]", error);
    }
};

export default mongoose;
