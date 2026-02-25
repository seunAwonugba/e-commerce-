import { CustomErrorHandler } from "../errors";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import mongoose from "../config/mongoose";

export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (err.isJoi == true) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
            success: false,
            message: err.details[0].message,
        });
    }

    if (err instanceof mongoose.Error.CastError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: `Invalid ${err.path}: ${err.value}`,
        });
    }

    if (err instanceof CustomErrorHandler) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            success: false,
            message: err.message,
        });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
};
