import express from "express";
import { createPayment, getPayment, getPayments } from "../controller/order";

const payment = express.Router();

payment.post("/", createPayment);
payment.post("/fetch", getPayments);
payment.get("/:id", getPayment);

export default payment;
