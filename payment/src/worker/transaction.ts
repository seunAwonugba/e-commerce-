import { TransactionRepository } from "../repository/transaction";
import { consumeMessages } from "../utils/broker";

const transactionRepository = new TransactionRepository();
export const startTransactionWorker = async () => {
    console.log("📥 Transaction worker started...");

    await consumeMessages("transactions", async (data) => {
        await transactionRepository.createTransaction(data);
    });
};
