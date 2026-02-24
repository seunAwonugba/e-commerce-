import mongoose from "mongoose";
import { dbUri } from "./env";

export const connectDb = async () => {
    try {
        await mongoose.connect(dbUri);
        console.log(
            "⚡️[product-database]: Database connection has been established successfully",
        );
    } catch (error) {
        console.log("😥 [product-database]", error);
    }
};

export default mongoose;
