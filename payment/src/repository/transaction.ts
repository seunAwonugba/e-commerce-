import { ITransaction } from "../interface/transaction";
import { transactions } from "../models/transaction";

export class TransactionRepository {
    async createTransaction(transaction: ITransaction) {
        const createTransaction = await transactions.create(transaction);
        return createTransaction;
    }

    async getTransaction(id: string) {
        const payment = await transactions.findById(id);

        return payment;
    }

    async updateTransaction(id: string, payload: any) {
        const invoice = await transactions.findOneAndUpdate(
            {
                _id: id,
            },
            {
                $set: payload,
            },
            { new: true },
        );
        return invoice;
    }
}
