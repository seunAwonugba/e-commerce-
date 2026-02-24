// Import your schemas here
import type { Connection } from "mongoose";
import { faker } from "@faker-js/faker";
import { productSchema } from "../models/product";
export async function up(connection: Connection): Promise<void> {
    const fakeProducts = Array.from({ length: 200 }).map(() => ({
        name: faker.commerce.productName(),
        price: faker.number.int({ min: 5000, max: 100000 }),
        quantity: faker.number.int({ min: 5, max: 100 }),
    }));

    const Product = connection.model("Product", productSchema);

    await Product.insertMany(fakeProducts);
}

export async function down(connection: Connection): Promise<void> {
    const Product = connection.model("Product", productSchema);

    await Product.deleteMany({});
}
