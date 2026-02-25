import mongoose from "../config/mongoose";

export interface ITransaction extends mongoose.Document {
    customerId: string;
    productId: string;
    quantity: number;
    amount: number;
    orderId: string;
    paymentId: string;
    status: string;
}

export type Status = "pending" | "completed" | "failed" | "cancelled";

// export interface PaymentStatusFilter {
//     orderId: string;
//     status: Status;
// }
