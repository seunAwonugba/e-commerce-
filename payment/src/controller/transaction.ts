import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { TransactionRepository } from "../repository/transaction";
import { TransactionService } from "../service/transaction";

const transactionRepository = new TransactionRepository();
const transactionService = new TransactionService(transactionRepository);

export const getTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        const payment = await transactionService.getTransaction(id);

        res.status(StatusCodes.OK).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        next(error);
    }
};

export const getTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { orderId, status, customerId, productId } = req.body;

        let transactions;
        if (orderId && status) {
            const payload = {
                orderId,
                status,
            };
            transactions =
                await transactionService.getTransactionByOrderIdAndStatus(
                    payload,
                );
        } else if (customerId) {
            transactions =
                await transactionService.getTransactionsByCustomerId(
                    customerId,
                );
        } else if (productId) {
            transactions =
                await transactionService.getTransactionsByProductId(productId);
        }

        res.status(StatusCodes.OK).json({
            success: true,
            data: transactions,
        });
    } catch (error) {
        next(error);
    }
};

export const updateTransactionStatusByOrderId = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { status, orderId } = req.body;

        const transaction =
            await transactionService.updateTransactionStatusByOrderId(
                orderId,
                status,
            );

        res.status(StatusCodes.OK).json({
            success: true,
            data: transaction,
        });
    } catch (error) {
        next(error);
    }
};
