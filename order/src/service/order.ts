import { paymentInstance } from "../axios";
import { NOT_FOUND } from "../constants/constant";
import { BadRequest } from "../errors";
import { tryCatchError } from "../helper/error";
import { IOrder, OrderStatusProductFilter } from "../interface/order";
import { OrderRepository } from "../repository/order";

export class OrderService {
    constructor(private orderRepository: OrderRepository) {}

    async createOrder(order: IOrder) {
        try {
            const { customerId, amount, productId, quantity } = order;
            const createOrder = await this.orderRepository.createOrder(order);

            const paymentPayload = {
                customerId,
                productId,
                quantity,
                amount,
                orderId: createOrder.id,
            };

            const createPayment = await paymentInstance.post(
                `/`,
                paymentPayload,
            );

            const payment = createPayment.data.data;
            return {
                order: createOrder,
                payment,
            };
        } catch (error) {
            tryCatchError(error);
        }
    }

    async getOrdersByCustomerId(customerId: string) {
        const orders =
            await this.orderRepository.getOrdersByCustomerId(customerId);

        return orders;
    }

    async getOrdersByProductId(productId: string) {
        const orders =
            await this.orderRepository.getOrdersByProductId(productId);

        return orders;
    }

    async getOrdersByStatusProductId(payload: OrderStatusProductFilter) {
        const orders =
            await this.orderRepository.getOrdersByStatusProductId(payload);

        return orders;
    }

    async getOrder(id: string) {
        const order = await this.orderRepository.getOrder(id);

        if (!order) {
            throw new BadRequest(`Order ${NOT_FOUND.toLowerCase()}`);
        }

        return order;
    }

    async updateOrderStatus(id: string, status: string) {
        const order = await this.getOrder(id);

        const updateOrder = await this.orderRepository.updateOrder(order.id, {
            status,
        });

        return updateOrder;
    }
}
