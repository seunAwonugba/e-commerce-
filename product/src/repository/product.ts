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

    async decrementProductQuantity(id: string, quantity: number) {
        const product = await products.findOneAndUpdate(
            {
                _id: id,
                quantity: { $gte: quantity },
            },
            {
                $inc: { quantity: -quantity },
            },
            {
                new: true,
                runValidators: true,
            },
        );
        return product;
    }
}
