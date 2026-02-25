import "dotenv/config";
import axios from "axios";
import { paymentServiceBaseUrl } from "../config/env";

export const paymentInstance = axios.create({
    baseURL: paymentServiceBaseUrl,
});
