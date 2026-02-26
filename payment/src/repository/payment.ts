import { IPayment, PaymentStatusFilter } from "../interface/payment";
import { payments } from "../models/payment";

export class PaymentRepository {
    async createPayment(payment: IPayment) {
        const createPayment = await payments.create(payment);
        return createPayment;
    }
    async getPaymentsByCustomerId(customerId: string) {
        const getPayments = await payments.find({
            customerId,
        });
        return getPayments;
    }
    async getPaymentsByProductId(productId: string) {
        const getPayments = await payments.find({
            productId,
        });
        return getPayments;
    }
    async getPaymentByOrderId(orderId: string) {
        const getPayments = await payments.findOne({
            orderId,
        });
        return getPayments;
    }
    async getPaymentsByStatusAndOrderId(payload: PaymentStatusFilter) {
        const { orderId, status } = payload;
        const getOrders = await payments.find({
            orderId,
            status,
        });
        return getOrders;
    }

    async getPayment(id: string) {
        const payment = await payments.findById(id);

        return payment;
    }

    async updatePayment(id: string, payload: any) {
        const vendor = await payments.findOneAndUpdate(
            {
                _id: id,
            },
            {
                $set: payload,
            },
            { new: true },
        );
        return vendor;
    }
}
