import Joi from "joi";
import {
    CUSTOMER_ID_NOT_EMPTY,
    CUSTOMER_ID_REQ,
    ORDER_ID_NOT_EMPTY,
    ORDER_ID_REQ,
} from "../constants/constant";

export const paymentSchema = Joi.object({
    customerId: Joi.string().trim().required().messages({
        "any.required": CUSTOMER_ID_REQ,
        "string.empty": CUSTOMER_ID_NOT_EMPTY,
    }),
    orderId: Joi.string().trim().required().messages({
        "any.required": ORDER_ID_REQ,
        "string.empty": ORDER_ID_NOT_EMPTY,
    }),
});
