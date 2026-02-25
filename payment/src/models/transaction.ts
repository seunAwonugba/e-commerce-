import mongoose from "../config/mongoose";
import {
    AMOUNT_REQ,
    CUSTOMER_ID_REQ,
    ORDER_ID_REQ,
    PENDING,
    PRODUCT_ID_REQ,
    QTY_REQ,
} from "../constants/constant";
import mongoosePaginate from "mongoose-paginate-v2";
import { IPayment } from "../interface/payment";

export const transactionSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: [true, CUSTOMER_ID_REQ],
        trim: true,
    },
    productId: {
        type: String,
        required: [true, PRODUCT_ID_REQ],
        trim: true,
    },
    quantity: {
        type: Number,
        required: [true, QTY_REQ],
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, AMOUNT_REQ],
        trim: true,
    },
    orderId: {
        type: String,
        required: [true, ORDER_ID_REQ],
        trim: true,
    },
    status: {
        type: String,
        required: true,
        default: PENDING,
        trim: true,
    },
});

transactionSchema.set("timestamps", true);

transactionSchema.plugin(mongoosePaginate);

transactionSchema.set("toJSON", { virtuals: true });
transactionSchema.set("toObject", { virtuals: true });

export const transactions = mongoose.model<
    IPayment,
    mongoose.PaginateModel<IPayment>
>("Transaction", transactionSchema);
