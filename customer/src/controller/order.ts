import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Order } from "../services/order";
import { CustomerRepository } from "../repository/customer";

const customerRepository = new CustomerRepository();
const order = new Order(customerRepository);

export const createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const createOrder = await order.createOrder(req.body);

        res.status(StatusCodes.OK).json(createOrder);
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
        const orders = await order.getOrders(req.body);

        res.status(StatusCodes.OK).json(orders);
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

        const getOrder = await order.getOrder(id);

        res.status(StatusCodes.OK).json(getOrder);
    } catch (error) {
        next(error);
    }
};
