import express from "express";
import {
    createPayment,
    getPayment,
    getPayments,
    updatePaymentStatusByOrderId,
} from "../controller/payment";

const payment = express.Router();

payment.post("/", createPayment);
payment.post("/fetch", getPayments);
payment.get("/:id", getPayment);
payment.patch("/status", updatePaymentStatusByOrderId);

export default payment;
