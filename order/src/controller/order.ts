import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { OrderRepository } from "../repository/order";
import { OrderService } from "../service/order";
import { orderSchema } from "../validator/order";

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);

export const createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const schema = await orderSchema.validateAsync(req.body);
        const order = await orderService.createOrder(schema);

        res.status(StatusCodes.OK).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};
export const getOrders = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { customerId, productId, status } = req.body;
        let orders;
        if (productId && status) {
            const payload = {
                productId,
                status,
            };
            orders = await orderService.getOrdersByStatusProductId(payload);
        }
        if (customerId) {
            orders = await orderService.getOrdersByCustomerId(customerId);
        } else if (productId) {
            orders = await orderService.getOrdersByProductId(productId);
        }

        res.status(StatusCodes.OK).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};

export const getOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        const order = await orderService.getOrder(id);

        res.status(StatusCodes.OK).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await orderService.updateOrderStatus(id, status);

        res.status(StatusCodes.OK).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};
