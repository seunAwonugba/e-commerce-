import mongoose from "../config/mongoose";
import {
    EMAIL_EXIST,
    EMAIL_REQUIRED,
    NAME_REQUIRED,
} from "../constants/constant";
export const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, NAME_REQUIRED],
        trim: true,
    },
    email: {
        type: String,
        required: [true, EMAIL_REQUIRED],
        unique: [true, EMAIL_EXIST],
        trim: true,
    },
});

customerSchema.set("timestamps", true);

export const customers = mongoose.model("Customer", customerSchema);
