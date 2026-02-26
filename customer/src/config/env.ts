export const port = Number(process.env.CUSTOMER_PORT);
export const host = String(process.env.CUSTOMER_HOST);
export const dbUri = String(process.env.MONGODB_CONNECTION_STRING);
export const productServiceBaseUrl = process.env.PRODUCT_SERVICE_BASE_URL;
export const orderServiceBaseUrl = process.env.ORDER_SERVICE_BASE_URL;
export const paymentServiceBaseUrl = process.env.PAYMENT_SERVICE_BASE_URL;
