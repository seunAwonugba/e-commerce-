import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { paymentSchema } from "../validator/payment";
import { PaymentRepository } from "../repository/payment";
import { PaymentService } from "../service/payment";

const paymentRepository = new PaymentRepository();
const paymentService = new PaymentService(paymentRepository);

export const createPayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const schema = await paymentSchema.validateAsync(req.body);
        const order = await paymentService.createPayment(schema);

        res.status(StatusCodes.OK).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};
export const getPayments = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { customerId, orderId, status } = req.body;
        let payments;
        if (orderId && status) {
            const payload = {
                orderId,
                status,
            };
            payments =
                await paymentService.getPaymentsByStatusProductId(payload);
        }
        if (customerId) {
            payments = await paymentService.getPaymentsByCustomerId(customerId);
        } else if (orderId) {
            payments = await paymentService.getPaymentsByOrderId(orderId);
        }

        res.status(StatusCodes.OK).json({
            success: true,
            data: payments,
        });
    } catch (error) {
        next(error);
    }
};

export const getPayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        const payment = await paymentService.getPayment(id);

        res.status(StatusCodes.OK).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        next(error);
    }
};
