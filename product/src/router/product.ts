import express from "express";

import { getProduct, getProducts } from "../controller/product";

const product = express.Router();

product.get("/", getProducts);
product.get("/:id", getProduct);

export default product;
