import Joi from "joi";
import {
    AMOUNT_NOT_EMPTY,
    AMOUNT_POSITIVE,
    AMOUNT_REQ,
    ORDER_ID_NOT_EMPTY,
    ORDER_ID_REQUIRED,
} from "../constants/constant";

export const orderPaymentSchema = Joi.object({
    orderId: Joi.string().trim().required().messages({
        "any.required": ORDER_ID_REQUIRED,
        "string.empty": ORDER_ID_NOT_EMPTY,
    }),
    amount: Joi.number().required().messages({
        "any.required": AMOUNT_REQ,
        "number.base": AMOUNT_NOT_EMPTY,
        "number.positive": AMOUNT_POSITIVE,
    }),
});
