import express from "express";

import { getCustomer, getCustomers } from "../controller/customer";

const customer = express.Router();

customer.get("/", getCustomers);
customer.get("/:id", getCustomer);

export default customer;
