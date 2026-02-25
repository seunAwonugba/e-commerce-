import Joi from "joi";
import {
    AMOUNT_NOT_EMPTY,
    AMOUNT_POSITIVE,
    AMOUNT_REQ,
    CUSTOMER_ID_NOT_EMPTY,
    CUSTOMER_ID_REQ,
    ORDER_ID_NOT_EMPTY,
    ORDER_ID_REQ,
    PRODUCT_ID_NOT_EMPTY,
    PRODUCT_ID_REQ,
    QTY_NOT_EMPTY,
    QTY_REQ,
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
    productId: Joi.string().trim().required().messages({
        "any.required": PRODUCT_ID_REQ,
        "string.empty": PRODUCT_ID_NOT_EMPTY,
    }),
    amount: Joi.number().required().messages({
        "any.required": AMOUNT_REQ,
        "number.base": AMOUNT_NOT_EMPTY,
        "number.positive": AMOUNT_POSITIVE,
    }),
    quantity: Joi.number().required().messages({
        "any.required": QTY_REQ,
        "number.base": QTY_NOT_EMPTY,
        "number.positive": AMOUNT_POSITIVE,
    }),
});
