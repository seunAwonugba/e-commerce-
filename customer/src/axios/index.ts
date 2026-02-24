import "dotenv/config";
import axios from "axios";
import { productServiceBaseUrl } from "../config/env";

export const productInstance = axios.create({
    baseURL: productServiceBaseUrl,
});
