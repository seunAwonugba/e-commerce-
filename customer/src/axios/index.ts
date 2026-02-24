import "dotenv/config";
import axios from "axios";
import { orderServiceBaseUrl, productServiceBaseUrl } from "../config/env";

export const productInstance = axios.create({
    baseURL: productServiceBaseUrl,
});

export const orderInstance = axios.create({
    baseURL: orderServiceBaseUrl,
});
