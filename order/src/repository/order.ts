import { IOrder, OrderStatusProductFilter } from "../interface/order";
import { orders } from "../models/order";

export class OrderRepository {
    async createOrder(order: IOrder) {
        const createOrder = await orders.create(order);
        return createOrder;
    }
    async getOrdersByCustomerId(customerId: string) {
        const getOrders = await orders.find({
            customerId,
        });
        return getOrders;
    }
    async getOrdersByProductId(productId: string) {
        const getOrders = await orders.find({
            productId,
        });
        return getOrders;
    }
    async getOrdersByStatusProductId(payload: OrderStatusProductFilter) {
        const { productId, status } = payload;
        const getOrders = await orders.find({
            productId,
            status,
        });
        return getOrders;
    }

    async getOrder(id: string) {
        const order = await orders.findById(id);

        return order;
    }
}
