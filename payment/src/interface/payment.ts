import mongoose from "../config/mongoose";

export interface IPayment extends mongoose.Document {
    customerId: string;
    orderId: string;
    amount: number;
}

export type Status = "pending" | "completed" | "failed" | "cancelled";

export interface PaymentStatusFilter {
    orderId: string;
    status: Status;
}
