import { products } from "../models/product";

export class ProductRepository {
    async getProducts() {
        const getProducts = await products.find();
        return getProducts;
    }

    async getProduct(id: string) {
        const product = await products.findById(id);

        return product;
    }
}
