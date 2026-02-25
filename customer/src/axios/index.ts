import "dotenv/config";
import axios from "axios";
import {
    orderServiceBaseUrl,
    paymentServiceBaseUrl,
    productServiceBaseUrl,
} from "../config/env";

export const productInstance = axios.create({
    baseURL: productServiceBaseUrl,
});

export const orderInstance = axios.create({
    baseURL: orderServiceBaseUrl,
});

export const paymentInstance = axios.create({
    baseURL: paymentServiceBaseUrl,
});
