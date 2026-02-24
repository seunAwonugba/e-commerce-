import { productInstance } from "../axios";
import { tryCatchError } from "../helper/error";

export class Product {
    constructor() {}

    async getProducts() {
        try {
            const products = await productInstance.get(`/`);
            return products.data;
        } catch (error: any) {
            tryCatchError(error);
        }
    }

    async getProduct(id: string) {
        try {
            const product = await productInstance.get(`/${id}`);
            return product.data;
        } catch (error: any) {
            tryCatchError(error);
        }
    }
}
