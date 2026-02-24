import { ProductRepository } from "../repository/product";

export class ProductService {
    constructor(private productRepository: ProductRepository) {}

    async getProducts() {
        const products = await this.productRepository.getProducts();

        return products;
    }

    async getProduct(id: string) {
        const product = await this.productRepository.getProduct(id);

        return product;
    }
}
