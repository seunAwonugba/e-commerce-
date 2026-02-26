import express from "express";
import { getTransaction, getTransactions } from "../controller/transaction";

const transaction = express.Router();

transaction.post("/", getTransactions);
transaction.get("/:id", getTransaction);

export default transaction;
