import mongoose from "../config/mongoose";
import {
    AMOUNT_REQ,
    CUSTOMER_ID_REQ,
    PENDING,
    PRODUCT_ID_REQ,
    QTY_REQ,
} from "../constants/constant";
import mongoosePaginate from "mongoose-paginate-v2";
import { IOrder } from "../interface/order";

export const orderSchema = new mongoose.Schema({
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
    amount: {
        type: Number,
        required: [true, AMOUNT_REQ],
        trim: true,
    },
    quantity: {
        type: Number,
        required: [true, QTY_REQ],
        trim: true,
    },
    status: {
        type: String,
        required: true,
        default: PENDING,
        trim: true,
    },
});

orderSchema.set("timestamps", true);

orderSchema.plugin(mongoosePaginate);

orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

export const orders = mongoose.model<IOrder, mongoose.PaginateModel<IOrder>>(
    "Order",
    orderSchema,
);
