import { paymentInstance } from "../axios";
import { tryCatchError } from "../helper/error";
import { ITransaction } from "../interface/transaction";

export class Transaction {
    constructor() {}

    async getTransactions(payload: ITransaction) {
        try {
            const transactions = await paymentInstance.post(
                `/transaction/fetch`,
                payload,
            );
            return transactions.data;
        } catch (error: any) {
            tryCatchError(error);
        }
    }

    async getTransaction(id: string) {
        try {
            const transaction = await paymentInstance.get(`/transaction/${id}`);
            return transaction.data;
        } catch (error: any) {
            tryCatchError(error);
        }
    }
}
