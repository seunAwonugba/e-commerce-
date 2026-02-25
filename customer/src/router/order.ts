import express from "express";
import { createOrder, getOrder, getOrders } from "../controller/order";
import { createOrderPayment } from "../controller/order-payment";

const order = express.Router();

order.post("/", createOrder);
order.post("/payment", createOrderPayment);
order.post("/fetch", getOrders);
order.get("/:id", getOrder);

export default order;
