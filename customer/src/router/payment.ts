import express from "express";
import { getPayment, getPayments } from "../controller/payment";

const payment = express.Router();

payment.post("/", getPayments);
payment.get("/:id", getPayment);

export default payment;
