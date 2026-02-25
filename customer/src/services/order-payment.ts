import { orderInstance, paymentInstance, productInstance } from "../axios";
import {
    COMPLETED,
    EXCESS_AMOUNT,
    INSUFFICIENT_AMOUNT,
} from "../constants/constant";
import { BadRequest } from "../errors";
import { tryCatchError } from "../helper/error";
import { IOrderPayment } from "../interface/order";

export class OrderPayment {
    constructor() {}

    async createOrderPayment(payload: IOrderPayment) {
        try {
            const { orderId, amount } = payload;
            const getOrder = await orderInstance.get(`/${orderId}`);

            const order = getOrder.data.data;
            const orderStatus = order.status;
            const orderAmount = order.amount;
            const orderProductId = order.productId;
            const orderQuantity = order.quantity;

            if (orderStatus == COMPLETED) {
                throw new BadRequest(`Order ${COMPLETED}`);
            }

            if (amount < orderAmount) {
                throw new BadRequest(INSUFFICIENT_AMOUNT);
            }

            if (amount > orderAmount) {
                throw new BadRequest(EXCESS_AMOUNT);
            }

            //update payment status by order id
            const completePayment = await paymentInstance.patch(
                "/payment/status",
                {
                    orderId,
                    status: COMPLETED,
                },
            );

            //update transaction status by order id
            const completeTransaction = await paymentInstance.patch(
                "/transaction/status",
                {
                    orderId,
                    status: COMPLETED,
                },
            );

            //update order status by order id
            const completeOrder = await orderInstance.patch(
                `/${orderId}/status`,
                {
                    status: COMPLETED,
                },
            );

            //update order status by order id
            const decrementProductQuantity = await productInstance.patch(
                `/${orderProductId}/decrement`,
                {
                    quantity: orderQuantity,
                },
            );

            return {
                order: completeOrder.data.data,
                transaction: completeTransaction.data.data,
                payment: completePayment.data.data,
                product: decrementProductQuantity.data.data,
            };
        } catch (error: any) {
            tryCatchError(error);
        }
    }
}
