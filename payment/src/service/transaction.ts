import { NOT_FOUND } from "../constants/constant";
import { BadRequest } from "../errors";
import { TransactionStatusFilter } from "../interface/transaction";
import { TransactionRepository } from "../repository/transaction";

export class TransactionService {
    constructor(private transactionRepository: TransactionRepository) {}

    async getTransactionByOrderIdAndStatus(payload: TransactionStatusFilter) {
        const transaction =
            await this.transactionRepository.getTransactionByOrderIdAndStatus(
                payload,
            );

        if (!transaction) {
            throw new BadRequest(`Transaction ${NOT_FOUND.toLowerCase()}`);
        }

        return transaction;
    }

    async getTransaction(id: string) {
        const transaction = await this.transactionRepository.getTransaction(id);

        if (!transaction) {
            throw new BadRequest(`Transaction ${NOT_FOUND.toLowerCase()}`);
        }

        return transaction;
    }

    async getTransactionByOrderId(orderId: string) {
        const transaction =
            await this.transactionRepository.getTransactionByOrderId(orderId);

        if (!transaction) {
            throw new BadRequest(`Transaction ${NOT_FOUND.toLowerCase()}`);
        }

        return transaction;
    }

    async updateTransactionStatusByOrderId(orderId: string, status: string) {
        const transaction = await this.getTransactionByOrderId(orderId);

        const updateTransactionStatus =
            await this.transactionRepository.updateTransaction(transaction.id, {
                status,
            });

        return updateTransactionStatus;
    }
}
