import express from "express";
import {
    getTransaction,
    getTransactions,
    updateTransactionStatusByOrderId,
} from "../controller/transaction";

const transaction = express.Router();

transaction.post("/fetch", getTransactions);
transaction.get("/:id", getTransaction);
transaction.patch("/status", updateTransactionStatusByOrderId);

export default transaction;
