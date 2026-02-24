import express from "express";
import { createOrder, getOrder, getOrders } from "../controller/order";

const order = express.Router();

order.post("/", createOrder);
order.post("/fetch", getOrders);
order.get("/:id", getOrder);

export default order;
