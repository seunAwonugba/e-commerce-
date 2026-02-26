import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Product } from "../services/product";
import { Payment } from "../services/payment";

const payment = new Payment();

export const getPayments = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const payments = await payment.getPayments(req.body);

        res.status(StatusCodes.OK).json(payments);
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

        const getProduct = await payment.getPayment(id);

        res.status(StatusCodes.OK).json(getProduct);
    } catch (error) {
        next(error);
    }
};
