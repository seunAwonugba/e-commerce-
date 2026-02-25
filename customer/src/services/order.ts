import { orderInstance, productInstance } from "../axios";
import { NOT_FOUND } from "../constants/constant";
import { BadRequest } from "../errors";
import { tryCatchError } from "../helper/error";
import { IOrder } from "../interface/order";
import { CustomerRepository } from "../repository/customer";

export class Order {
    constructor(private customerRepository: CustomerRepository) {}

    async createOrder(order: IOrder) {
        try {
            const { customerId, productId, quantity } = order;
            const getCustomer =
                await this.customerRepository.getCustomer(customerId);

            if (!getCustomer) {
                throw new BadRequest(`Customer ${NOT_FOUND.toLowerCase()}`);
            }
            const getProduct = await productInstance.get(`/${productId}`);
            const product = getProduct.data.data;
            const price = product.price;

            const getCompletedOrders = await orderInstance.post(`/fetch`, {
                productId,
            });

            const completedOrders = getCompletedOrders.data.data;

            const createOrderPayload = {
                customerId: getCustomer.id,
                productId,
                amount: price * quantity,
                quantity,
            };

            const createOrder = await orderInstance.post(
                `/`,
                createOrderPayload,
            );
            return createOrder.data;
        } catch (error: any) {
            tryCatchError(error);
        }
    }

    async getOrders(payload: any) {
        try {
            const orders = await orderInstance.post(`/fetch`, payload);
            return orders.data;
        } catch (error: any) {
            tryCatchError(error);
        }
    }

    async getOrder(id: string) {
        try {
            const order = await orderInstance.get(`/${id}`);
            return order.data;
        } catch (error: any) {
            tryCatchError(error);
        }
    }
}
