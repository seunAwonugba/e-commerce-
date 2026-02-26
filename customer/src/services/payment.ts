import { paymentInstance } from "../axios";
import { tryCatchError } from "../helper/error";
import { IPayment } from "../interface/payment";

export class Payment {
    constructor() {}

    async getPayments(payload: IPayment) {
        try {
            const payments = await paymentInstance.post(
                `/payment/fetch`,
                payload,
            );
            return payments.data;
        } catch (error: any) {
            tryCatchError(error);
        }
    }

    async getPayment(id: string) {
        try {
            const payment = await paymentInstance.get(`/payment/${id}`);
            return payment.data;
        } catch (error: any) {
            tryCatchError(error);
        }
    }
}
