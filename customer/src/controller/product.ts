import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Product } from "../services/product";

const product = new Product();

export const getProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const products = await product.getProducts();

        res.status(StatusCodes.OK).json(products);
    } catch (error) {
        next(error);
    }
};

export const getProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        const getProduct = await product.getProduct(id);

        res.status(StatusCodes.OK).json(getProduct);
    } catch (error) {
        next(error);
    }
};
