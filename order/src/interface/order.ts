import mongoose from "../config/mongoose";

export interface IOrder extends mongoose.Document {
    customerId: string;
    productId: string;
    amount: number;
    quantity: number;
    status?: string;
}

export type OrderStatus = "pending" | "completed" | "failed" | "cancelled";

export interface OrderStatusProductFilter {
    productId: string;
    status: OrderStatus;
}
