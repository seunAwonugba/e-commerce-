/**
 * OrderPayment Tests
 *
 * Flow under test (customer service entry point):
 *   POST /order/payment  →  OrderPayment.createOrderPayment()
 *     1. Fetch order from order service
 *     2. Validate status / amount
 *     3. PATCH payment status   → payment service
 *     4. PATCH transaction status → payment service
 *     5. PATCH order status     → order service
 *     6. PATCH product quantity → product service
 *     7. Return { order, transaction, payment, product }
 *
 * All outbound HTTP calls are mocked — no live servers needed.
 */

import { OrderPayment } from "../src/services/order-payment";
import { BadRequest } from "../src/errors";

// ---------------------------------------------------------------------------
// Mock all three axios instances before any imports that use them
// ---------------------------------------------------------------------------
jest.mock("../src/axios", () => ({
    productInstance: { get: jest.fn(), patch: jest.fn() },
    orderInstance: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
    paymentInstance: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));

import { productInstance, orderInstance, paymentInstance } from "../src/axios";

const mockedOrderGet = orderInstance.get as jest.Mock;
const mockedOrderPatch = orderInstance.patch as jest.Mock;
const mockedPaymentPatch = paymentInstance.patch as jest.Mock;
const mockedProductPatch = productInstance.patch as jest.Mock;

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const orderId = "67b1e4f8a2c3d10012345678"; // valid-looking ObjectId strings
const productId = "67b1e4f8a2c3d10012345679";
const customerId = "67b1e4f8a2c3d10012345680";

const pendingOrder = {
    _id: orderId,
    id: orderId,
    customerId,
    productId,
    amount: 15000,
    quantity: 2,
    status: "pending",
};

const completedOrderData = { ...pendingOrder, status: "completed" };
const completedPaymentData = { _id: "pay-id", orderId, status: "completed" };
const completedTransactionData = {
    _id: "txn-id",
    orderId,
    status: "completed",
};
const updatedProductData = { _id: productId, quantity: 18 };

// ---------------------------------------------------------------------------
// Helper — set up the four "happy path" patch mocks in one place
// ---------------------------------------------------------------------------
function mockAllPatchesSuccess() {
    // paymentInstance.patch is called twice: /payment/status then /transaction/status
    mockedPaymentPatch
        .mockResolvedValueOnce({ data: { data: completedPaymentData } }) // /payment/status
        .mockResolvedValueOnce({ data: { data: completedTransactionData } }); // /transaction/status

    mockedOrderPatch.mockResolvedValue({ data: { data: completedOrderData } });
    mockedProductPatch.mockResolvedValue({
        data: { data: updatedProductData },
    });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("OrderPayment", () => {
    let orderPayment: OrderPayment;

    beforeEach(() => {
        jest.clearAllMocks();
        orderPayment = new OrderPayment();
    });

    // -------------------------------------------------------------------------
    describe("createOrderPayment()", () => {
        it("should complete an order and return order, payment, transaction and product", async () => {
            mockedOrderGet.mockResolvedValue({ data: { data: pendingOrder } });
            mockAllPatchesSuccess();

            const result = await orderPayment.createOrderPayment({
                orderId,
                amount: 15000,
            });

            // Correct order was fetched
            expect(mockedOrderGet).toHaveBeenCalledWith(`/${orderId}`);

            // Payment status updated
            expect(mockedPaymentPatch).toHaveBeenNthCalledWith(
                1,
                "/payment/status",
                { orderId, status: "completed" },
            );

            // Transaction status updated
            expect(mockedPaymentPatch).toHaveBeenNthCalledWith(
                2,
                "/transaction/status",
                { orderId, status: "completed" },
            );

            // Order status updated
            expect(mockedOrderPatch).toHaveBeenCalledWith(
                `/${orderId}/status`,
                {
                    status: "completed",
                },
            );

            // Product quantity decremented
            expect(mockedProductPatch).toHaveBeenCalledWith(
                `/${productId}/decrement`,
                { quantity: pendingOrder.quantity },
            );

            // Return shape is correct
            expect(result).toEqual({
                order: completedOrderData,
                payment: completedPaymentData,
                transaction: completedTransactionData,
                product: updatedProductData,
            });
        });

        // ---------------------------------------------------------------------
        it("should throw BadRequest when the order is already completed", async () => {
            mockedOrderGet.mockResolvedValue({
                data: { data: { ...pendingOrder, status: "completed" } },
            });

            await expect(
                orderPayment.createOrderPayment({ orderId, amount: 15000 }),
            ).rejects.toThrow(BadRequest);

            await expect(
                orderPayment.createOrderPayment({ orderId, amount: 15000 }),
            ).rejects.toThrow(/completed/i);

            // No patches should have been called
            expect(mockedPaymentPatch).not.toHaveBeenCalled();
            expect(mockedOrderPatch).not.toHaveBeenCalled();
        });

        // ---------------------------------------------------------------------
        it("should throw BadRequest when the amount paid is less than the order amount", async () => {
            mockedOrderGet.mockResolvedValue({ data: { data: pendingOrder } });

            await expect(
                orderPayment.createOrderPayment({ orderId, amount: 5000 }),
            ).rejects.toThrow(BadRequest);

            await expect(
                orderPayment.createOrderPayment({ orderId, amount: 5000 }),
            ).rejects.toThrow(/insufficient/i);

            expect(mockedPaymentPatch).not.toHaveBeenCalled();
        });

        // ---------------------------------------------------------------------
        it("should throw BadRequest when the amount paid exceeds the order amount", async () => {
            mockedOrderGet.mockResolvedValue({ data: { data: pendingOrder } });

            await expect(
                orderPayment.createOrderPayment({ orderId, amount: 99999 }),
            ).rejects.toThrow(BadRequest);

            await expect(
                orderPayment.createOrderPayment({ orderId, amount: 99999 }),
            ).rejects.toThrow(/excess/i);

            expect(mockedPaymentPatch).not.toHaveBeenCalled();
        });

        // ---------------------------------------------------------------------
        it("should throw BadRequest when the order is not found", async () => {
            mockedOrderGet.mockRejectedValue({
                response: { data: { message: "Order not found" }, status: 404 },
            });

            await expect(
                orderPayment.createOrderPayment({ orderId, amount: 15000 }),
            ).rejects.toThrow(BadRequest);
        });

        // ---------------------------------------------------------------------
        it("should propagate BadRequest when updating payment status fails", async () => {
            mockedOrderGet.mockResolvedValue({ data: { data: pendingOrder } });

            mockedPaymentPatch.mockRejectedValue({
                response: {
                    data: { message: "Payment update failed" },
                    status: 500,
                },
            });

            await expect(
                orderPayment.createOrderPayment({ orderId, amount: 15000 }),
            ).rejects.toThrow(BadRequest);
        });

        // ---------------------------------------------------------------------
        it("should propagate BadRequest when updating order status fails", async () => {
            mockedOrderGet.mockResolvedValue({ data: { data: pendingOrder } });

            // Payment patches succeed
            mockedPaymentPatch
                .mockResolvedValueOnce({ data: { data: completedPaymentData } })
                .mockResolvedValueOnce({
                    data: { data: completedTransactionData },
                });

            mockedOrderPatch.mockRejectedValue({
                response: {
                    data: { message: "Order update failed" },
                    status: 500,
                },
            });

            await expect(
                orderPayment.createOrderPayment({ orderId, amount: 15000 }),
            ).rejects.toThrow(BadRequest);
        });

        // ---------------------------------------------------------------------
        it("should propagate BadRequest when decrementing product quantity fails", async () => {
            mockedOrderGet.mockResolvedValue({ data: { data: pendingOrder } });
            mockedPaymentPatch
                .mockResolvedValueOnce({ data: { data: completedPaymentData } })
                .mockResolvedValueOnce({
                    data: { data: completedTransactionData },
                });
            mockedOrderPatch.mockResolvedValue({
                data: { data: completedOrderData },
            });

            mockedProductPatch.mockRejectedValue({
                response: {
                    data: { message: "Product update failed" },
                    status: 500,
                },
            });

            await expect(
                orderPayment.createOrderPayment({ orderId, amount: 15000 }),
            ).rejects.toThrow(BadRequest);
        });

        // ---------------------------------------------------------------------
        it("should call patches with exact amount 0 when order amount is 0", async () => {
            const freeOrder = { ...pendingOrder, amount: 0 };
            mockedOrderGet.mockResolvedValue({ data: { data: freeOrder } });
            mockAllPatchesSuccess();

            const result = await orderPayment.createOrderPayment({
                orderId,
                amount: 0,
            });

            expect(result).toHaveProperty("order");
            expect(result).toHaveProperty("payment");
            expect(result).toHaveProperty("transaction");
            expect(result).toHaveProperty("product");
        });
    });
});
