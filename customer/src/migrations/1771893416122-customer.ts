// Import your schemas here
import type { Connection } from "mongoose";
import { faker } from "@faker-js/faker";
import { customerSchema } from "../models/customer";
export async function up(connection: Connection): Promise<void> {
    const fakeCustomers = Array.from({ length: 5 }).map(() => ({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
    }));
    console.log("fakeCustomers", fakeCustomers);

    const Customer = connection.model("Customer", customerSchema);

    await Customer.insertMany(fakeCustomers);
}

export async function down(connection: Connection): Promise<void> {
    const Customer = connection.model("Customer", customerSchema);

    await Customer.deleteMany({});
}
