import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomerRepository } from "../repository/customer";
import { CustomerService } from "../service/customer";

const customerRepository = new CustomerRepository();
const customerService = new CustomerService(customerRepository);

export const getCustomers = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const customers = await customerService.getCustomers();

        res.status(StatusCodes.OK).json({
            success: true,
            data: customers,
        });
    } catch (error) {
        next(error);
    }
};

export const getCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        const customer = await customerService.getCustomer(id);

        res.status(StatusCodes.OK).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};
