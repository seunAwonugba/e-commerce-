import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Transaction } from "../services/transaction";

const transaction = new Transaction();

export const getTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const transactions = await transaction.getTransactions(req.body);

        res.status(StatusCodes.OK).json(transactions);
    } catch (error) {
        next(error);
    }
};

export const getTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        const getTransaction = await transaction.getTransaction(id);

        res.status(StatusCodes.OK).json(getTransaction);
    } catch (error) {
        next(error);
    }
};
