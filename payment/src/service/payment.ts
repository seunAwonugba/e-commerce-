import { NOT_FOUND } from "../constants/constant";
import { BadRequest } from "../errors";
import { tryCatchError } from "../helper/error";
import { IPayment, PaymentStatusFilter } from "../interface/payment";
import { PaymentRepository } from "../repository/payment";
import { publishMessage } from "../utils/broker";

export class PaymentService {
    constructor(private paymentRepository: PaymentRepository) {}

    async createPayment(payment: IPayment) {
        try {
            const createPayment =
                await this.paymentRepository.createPayment(payment);

            const publishTrx = await publishMessage("transactions", payment);
            console.log("publishTrx", publishTrx);

            return createPayment;
        } catch (error) {
            tryCatchError(error);
        }
    }

    async getPaymentsByCustomerId(customerId: string) {
        const orders =
            await this.paymentRepository.getPaymentsByCustomerId(customerId);

        return orders;
    }

    async getPaymentsByOrderId(orderId: string) {
        const payments =
            await this.paymentRepository.getPaymentsByOrderId(orderId);

        return payments;
    }

    async getPaymentsByStatusProductId(payload: PaymentStatusFilter) {
        const payments =
            await this.paymentRepository.getPaymentsByStatusAndOrderId(payload);

        return payments;
    }

    async getPayment(id: string) {
        const payment = await this.paymentRepository.getPayment(id);

        if (!payment) {
            throw new BadRequest(`Payment ${NOT_FOUND.toLowerCase()}`);
        }

        return payment;
    }
}
