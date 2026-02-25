export interface IOrder {
    customerId: string;
    productId: string;
    quantity: number;
}
export interface IOrderPayment {
    orderId: string;
    amount: number;
}
