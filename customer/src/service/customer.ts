import { NOT_FOUND } from "../constants/constant";
import { BadRequest } from "../errors";
import { CustomerRepository } from "../repository/customer";

export class CustomerService {
    constructor(private customerRepository: CustomerRepository) {}

    async getCustomers() {
        const customers = await this.customerRepository.getCustomers();

        return customers;
    }

    async getCustomer(id: string) {
        const customer = await this.customerRepository.getCustomer(id);
        if (!customer) {
            throw new BadRequest(`Customer ${NOT_FOUND.toLowerCase()}`);
        }

        return customer;
    }
}
