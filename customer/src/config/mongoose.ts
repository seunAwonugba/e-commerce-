import mongoose from "mongoose";
import { dbUri } from "./env";

export const connectDb = async () => {
    try {
        await mongoose.connect(dbUri);
        console.log(
            "⚡️[customer-database]: Database connection has been established successfully",
        );
    } catch (error) {
        console.log("😥 [customer-database]", error);
    }
};

export default mongoose;
