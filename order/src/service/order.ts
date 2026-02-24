import { NOT_FOUND } from "../constants/constant";
import { BadRequest } from "../errors";
import { IOrder, OrderStatusProductFilter } from "../interface/order";
import { OrderRepository } from "../repository/order";

export class OrderService {
    constructor(private orderRepository: OrderRepository) {}

    async createOrder(order: IOrder) {
        const orders = await this.orderRepository.createOrder(order);

        return orders;
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
}
