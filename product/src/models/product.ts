import mongoose from "../config/mongoose";
import {
    PRICE_REQUIRED,
    NAME_REQUIRED,
    QUANTITY_REQUIRED,
} from "../constants/constant";
export const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, `Product ${NAME_REQUIRED.toLowerCase()}`],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, PRICE_REQUIRED],
        trim: true,
    },
    quantity: {
        type: Number,
        required: [true, QUANTITY_REQUIRED],
        trim: true,
    },
});

productSchema.set("timestamps", true);

export const products = mongoose.model("Product", productSchema);
