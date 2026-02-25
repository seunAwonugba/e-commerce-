import { NOT_FOUND } from "../constants/constant";
import { BadRequest } from "../errors";
import { ProductRepository } from "../repository/product";

export class ProductService {
    constructor(private productRepository: ProductRepository) {}

    async getProducts() {
        const products = await this.productRepository.getProducts();

        return products;
    }

    async getProduct(id: string) {
        const product = await this.productRepository.getProduct(id);

        if (!product) {
            throw new BadRequest(`Product ${NOT_FOUND.toLowerCase()}`);
        }

        return product;
    }

    async decrementProductQuantity(id: string, quantity: number) {
        const product = await this.productRepository.decrementProductQuantity(
            id,
            quantity,
        );

        return product;
    }
}
