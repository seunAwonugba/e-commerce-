import express from "express";

import {
    createOrder,
    getOrder,
    getOrders,
    updateOrderStatus,
} from "../controller/order";

const order = express.Router();

order.post("/", createOrder);
order.post("/fetch", getOrders);
order.get("/:id", getOrder);
order.patch("/:id/status", updateOrderStatus);

export default order;
