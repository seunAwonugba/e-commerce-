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

            //publish transaction
            await publishMessage("transactions", {
                ...payment,
                paymentId: createPayment.id,
            });

            return createPayment;
        } catch (error) {
            tryCatchError(error);
        }
    }

    async getPaymentsByCustomerId(customerId: string) {
        const products =
            await this.paymentRepository.getPaymentsByCustomerId(customerId);

        return products;
    }

    async getPaymentsByProductId(productId: string) {
        const products =
            await this.paymentRepository.getPaymentsByProductId(productId);

        return products;
    }

    async getPaymentByOrderId(orderId: string) {
        const payment =
            await this.paymentRepository.getPaymentByOrderId(orderId);

        if (!payment) {
            throw new BadRequest(`Payment ${NOT_FOUND.toLowerCase()}`);
        }

        return payment;
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

    async updatePaymentStatusByOrderId(orderId: string, status: string) {
        const payment = await this.getPaymentByOrderId(orderId);

        const updatePaymentStatus = await this.paymentRepository.updatePayment(
            payment.id,
            {
                status,
            },
        );

        return updatePaymentStatus;
    }
}
