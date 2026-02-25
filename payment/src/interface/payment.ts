import mongoose from "../config/mongoose";

export interface IPayment extends mongoose.Document {
    customerId: string;
    productId: string;
    quantity: number;
    amount: number;
    orderId: string;
    status: string;
}

export interface IPaymentTransaction {
    customerId: string;
    productId: string;
    quantity: number;
    amount: number;
    orderId: string;
    status: string;
    paymentId: string;
}

export type Status = "pending" | "completed" | "failed" | "cancelled";

export interface PaymentStatusFilter {
    orderId: string;
    status: Status;
}
