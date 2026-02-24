import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ProductRepository } from "../repository/product";
import { ProductService } from "../service/product";

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);

export const getProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const products = await productService.getProducts();

        res.status(StatusCodes.OK).json({
            success: true,
            data: products,
        });
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

        const product = await productService.getProduct(id);

        res.status(StatusCodes.OK).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};
