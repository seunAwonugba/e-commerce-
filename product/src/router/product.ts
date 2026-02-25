import express from "express";

import {
    decrementProductQuantity,
    getProduct,
    getProducts,
} from "../controller/product";

const product = express.Router();

product.get("/", getProducts);
product.get("/:id", getProduct);
product.patch("/:id/decrement", decrementProductQuantity);

export default product;
