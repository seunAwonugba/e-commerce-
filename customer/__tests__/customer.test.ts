/**
 * Customer Service - Integration & Unit Tests
 *
 * These tests cover:
 * 1. CustomerService (getCustomers, getCustomer)
 * 2. Product (getProducts, getProduct) — via mocked axios
 * 3. Order (createOrder, getOrders, getOrder) — via mocked axios
 *
 * External HTTP calls (productInstance, orderInstance) are mocked so
 * tests run without live servers.
 */

import { Product } from "../src/services/product";
import { Order } from "../src/services/order";
import { BadRequest } from "../src/errors";

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const mockCustomer = {
    id: "cust-001",
    _id: "cust-001",
    name: "Jane Doe",
    email: "jane@example.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
};

const mockProduct = {
    _id: "prod-001",
    id: "prod-001",
    name: "Wireless Headphones",
    price: 15000,
    quantity: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
};

const mockOrder = {
    _id: "order-001",
    id: "order-001",
    customerId: mockCustomer.id,
    productId: mockProduct.id,
    amount: 15000,
    quantity: 1,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
};

const mockPayment = {
    _id: "pay-001",
    id: "pay-001",
    customerId: mockCustomer.id,
    productId: mockProduct.id,
    orderId: mockOrder.id,
    amount: 15000,
    quantity: 1,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
};

// ---------------------------------------------------------------------------
// Mock axios instances used inside the services
// ---------------------------------------------------------------------------

jest.mock("../src/axios", () => ({
    productInstance: {
        get: jest.fn(),
    },
    orderInstance: {
        get: jest.fn(),
        post: jest.fn(),
    },
}));

import { productInstance, orderInstance } from "../src/axios";
import { CustomerService } from "../src/service/customer";

const mockedProductGet = productInstance.get as jest.Mock;
const mockedOrderGet = orderInstance.get as jest.Mock;
const mockedOrderPost = orderInstance.post as jest.Mock;

// ---------------------------------------------------------------------------
// Mock CustomerRepository
// ---------------------------------------------------------------------------

const mockCustomerRepository = {
    getCustomers: jest.fn(),
    getCustomer: jest.fn(),
};

// ---------------------------------------------------------------------------
// 1. CustomerService tests
// ---------------------------------------------------------------------------

describe("CustomerService", () => {
    let customerService: CustomerService;

    beforeEach(() => {
        jest.clearAllMocks();
        customerService = new CustomerService(mockCustomerRepository as any);
    });

    // -------------------------------------------------------------------------
    describe("getCustomers()", () => {
        it("should return a list of customers", async () => {
            const mockList = [
                mockCustomer,
                { ...mockCustomer, id: "cust-002", name: "John Smith" },
            ];
            mockCustomerRepository.getCustomers.mockResolvedValue(mockList);

            const result = await customerService.getCustomers();

            expect(mockCustomerRepository.getCustomers).toHaveBeenCalledTimes(
                1,
            );
            expect(result).toHaveLength(2);
            expect(result[0]).toMatchObject({ name: "Jane Doe" });
        });

        it("should return an empty array when no customers exist", async () => {
            mockCustomerRepository.getCustomers.mockResolvedValue([]);

            const result = await customerService.getCustomers();

            expect(result).toEqual([]);
        });
    });

    // -------------------------------------------------------------------------
    describe("getCustomer(id)", () => {
        it("should return the customer for a valid id", async () => {
            mockCustomerRepository.getCustomer.mockResolvedValue(mockCustomer);

            const result = await customerService.getCustomer("cust-001");

            expect(mockCustomerRepository.getCustomer).toHaveBeenCalledWith(
                "cust-001",
            );
            expect(result).toMatchObject({ id: "cust-001", name: "Jane Doe" });
        });

        it("should throw BadRequest when customer is not found", async () => {
            mockCustomerRepository.getCustomer.mockResolvedValue(null);

            await expect(
                customerService.getCustomer("unknown-id"),
            ).rejects.toThrow(BadRequest);
            await expect(
                customerService.getCustomer("unknown-id"),
            ).rejects.toThrow(/not found/i);
        });
    });
});

// ---------------------------------------------------------------------------
// 2. Product service tests (network calls mocked)
// ---------------------------------------------------------------------------

describe("Product (via productInstance)", () => {
    let productService: Product;

    beforeEach(() => {
        jest.clearAllMocks();
        productService = new Product();
    });

    // -------------------------------------------------------------------------
    describe("getProducts()", () => {
        it("should return product list from the product service", async () => {
            const responsePayload = { success: true, data: [mockProduct] };
            mockedProductGet.mockResolvedValue({ data: responsePayload });

            const result = await productService.getProducts();

            expect(mockedProductGet).toHaveBeenCalledWith("/");
            expect(result).toEqual(responsePayload);
        });

        it("should propagate errors thrown by the product service", async () => {
            mockedProductGet.mockRejectedValue({
                response: {
                    data: { message: "Service unavailable" },
                    status: 503,
                },
            });

            await expect(productService.getProducts()).rejects.toBeDefined();
        });
    });

    // -------------------------------------------------------------------------
    describe("getProduct(id)", () => {
        it("should return a single product for a valid id", async () => {
            const responsePayload = { success: true, data: mockProduct };
            mockedProductGet.mockResolvedValue({ data: responsePayload });

            const result = await productService.getProduct("prod-001");

            expect(mockedProductGet).toHaveBeenCalledWith("/prod-001");
            expect(result).toEqual(responsePayload);
        });

        it("should propagate a 404 when product does not exist", async () => {
            mockedProductGet.mockRejectedValue({
                response: {
                    data: { message: "Product not found" },
                    status: 404,
                },
            });

            await expect(
                productService.getProduct("invalid-id"),
            ).rejects.toBeDefined();
        });
    });
});

// ---------------------------------------------------------------------------
// 3. Order service tests (network calls mocked)
// ---------------------------------------------------------------------------

describe("Order (via productInstance + orderInstance)", () => {
    let orderService: Order;

    beforeEach(() => {
        jest.clearAllMocks();
        orderService = new Order(mockCustomerRepository as any);
    });

    // -------------------------------------------------------------------------
    describe("createOrder()", () => {
        const orderPayload = {
            customerId: "cust-001",
            productId: "prod-001",
            quantity: 1,
        };

        it("should create an order and return order + payment data", async () => {
            // customer exists in local DB
            mockCustomerRepository.getCustomer.mockResolvedValue(mockCustomer);
            // product fetched from product service
            mockedProductGet.mockResolvedValue({ data: { data: mockProduct } });
            // order service responds
            const orderResponse = {
                data: { data: { order: mockOrder, payment: mockPayment } },
            };
            mockedOrderPost.mockResolvedValue(orderResponse);

            const result = await orderService.createOrder(orderPayload as any);

            expect(mockCustomerRepository.getCustomer).toHaveBeenCalledWith(
                "cust-001",
            );
            expect(mockedProductGet).toHaveBeenCalledWith("/prod-001");
            expect(mockedOrderPost).toHaveBeenCalledWith(
                "/",
                expect.objectContaining({
                    customerId: mockCustomer.id,
                    productId: "prod-001",
                    quantity: 1,
                    amount: mockProduct.price * 1,
                }),
            );
            expect(result).toEqual(orderResponse.data);
        });

        it("should throw BadRequest when customer does not exist", async () => {
            mockCustomerRepository.getCustomer.mockResolvedValue(null);

            await expect(
                orderService.createOrder(orderPayload as any),
            ).rejects.toThrow(BadRequest);
            await expect(
                orderService.createOrder(orderPayload as any),
            ).rejects.toThrow(/not found/i);
        });

        it("should throw BadRequest when product is out of stock (quantity = 0)", async () => {
            mockCustomerRepository.getCustomer.mockResolvedValue(mockCustomer);
            mockedProductGet.mockResolvedValue({
                data: { data: { ...mockProduct, quantity: 0 } },
            });

            await expect(
                orderService.createOrder(orderPayload as any),
            ).rejects.toThrow(BadRequest);
        });

        it("should throw BadRequest when requested quantity exceeds available stock", async () => {
            mockCustomerRepository.getCustomer.mockResolvedValue(mockCustomer);
            mockedProductGet.mockResolvedValue({
                data: { data: { ...mockProduct, quantity: 2 } },
            });

            const highQtyPayload = { ...orderPayload, quantity: 10 };

            await expect(
                orderService.createOrder(highQtyPayload as any),
            ).rejects.toThrow(BadRequest);
        });

        it("should calculate amount correctly (price × quantity)", async () => {
            mockCustomerRepository.getCustomer.mockResolvedValue(mockCustomer);
            mockedProductGet.mockResolvedValue({
                data: { data: { ...mockProduct, price: 5000, quantity: 10 } },
            });
            mockedOrderPost.mockResolvedValue({ data: { data: {} } });

            const qty3Payload = { ...orderPayload, quantity: 3 };
            await orderService.createOrder(qty3Payload as any);

            expect(mockedOrderPost).toHaveBeenCalledWith(
                "/",
                expect.objectContaining({ amount: 5000 * 3 }),
            );
        });
    });

    // -------------------------------------------------------------------------
    describe("getOrders(payload)", () => {
        it("should fetch orders by customerId", async () => {
            const payload = { customerId: "cust-001" };
            const mockOrders = { success: true, data: [mockOrder] };
            mockedOrderPost.mockResolvedValue({ data: mockOrders });

            const result = await orderService.getOrders(payload);

            expect(mockedOrderPost).toHaveBeenCalledWith("/fetch", payload);
            expect(result).toEqual(mockOrders);
        });

        it("should fetch orders by productId", async () => {
            const payload = { productId: "prod-001" };
            const mockOrders = { success: true, data: [mockOrder] };
            mockedOrderPost.mockResolvedValue({ data: mockOrders });

            const result = await orderService.getOrders(payload);

            expect(mockedOrderPost).toHaveBeenCalledWith("/fetch", payload);
            expect(result).toEqual(mockOrders);
        });
    });

    // -------------------------------------------------------------------------
    describe("getOrder(id)", () => {
        it("should return a single order by id", async () => {
            const mockOrderResponse = { success: true, data: mockOrder };
            mockedOrderGet.mockResolvedValue({ data: mockOrderResponse });

            const result = await orderService.getOrder("order-001");

            expect(mockedOrderGet).toHaveBeenCalledWith("/order-001");
            expect(result).toEqual(mockOrderResponse);
        });

        it("should propagate errors from order service", async () => {
            mockedOrderGet.mockRejectedValue({
                response: { data: { message: "Order not found" }, status: 404 },
            });

            await expect(orderService.getOrder("bad-id")).rejects.toBeDefined();
        });
    });
});
