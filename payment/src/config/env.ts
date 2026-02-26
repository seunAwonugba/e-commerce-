export const port = Number(process.env.PAYMENT_PORT);
export const host = String(process.env.PAYMENT_HOST);
export const dbUri = String(process.env.MONGODB_CONNECTION_STRING);
export const productServiceBaseUrl = process.env.PRODUCT_SERVICE_BASE_URL;
export const orderServiceBaseUrl = process.env.ORDER_SERVICE_BASE_URL;
export const rabbitMqUrl = String(process.env.RABBITMQ_URL);
