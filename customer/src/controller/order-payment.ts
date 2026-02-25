import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { OrderPayment } from "../services/order-payment";
import { orderPaymentSchema } from "../validator/order-payment";
import { ORDER_AND_PAYMENT_COMPLETED } from "../constants/constant";

const orderPayment = new OrderPayment();

export const createOrderPayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const schema = await orderPaymentSchema.validateAsync(req.body);
        const createOrder = await orderPayment.createOrderPayment(schema);

        res.status(StatusCodes.OK).json({
            success: true,
            data: createOrder,
            message: ORDER_AND_PAYMENT_COMPLETED,
        });
    } catch (error) {
        next(error);
    }
};
