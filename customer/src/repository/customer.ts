import { customers } from "../models/customer";

export class CustomerRepository {
    async getCustomers() {
        const getCustomers = await customers.find();
        return getCustomers;
    }

    async getCustomer(id: string) {
        const customer = await customers.findById(id);

        return customer;
    }
}
