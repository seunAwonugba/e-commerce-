const allowedOrigins = [
    "http://localhost:5173", // for dev
    "http://localhost:8000", // for dev
    "https://stride-frontend.netlify.app",
];

// CORS configuration
export const corsOptions = {
    origin: function (origin: any, callback: any) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if the origin is in the allowed list
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Allow cookies and credentials
    optionsSuccessStatus: 200, // Support legacy browsers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
    ],
    exposedHeaders: ["X-Total-Count", "x-request-id"], // Headers that client can access
};
export const NAME_REQUIRED = "Name is required";
export const ORDER_ID_REQUIRED = "Order id is required";
export const ORDER_ID_NOT_EMPTY = "Order id cannot be empty";
export const EMAIL_REQUIRED = "Email address is required";
export const VALID_EMAIL = "Valid email required";
export const EMAIL_EXIST = "Email exist";
export const AGGREGATE_ERROR = "AggregateError";
export const ECONNREFUSED =
    "One or more services are down, please try again later";
export const NOT_FOUND = "Not found";
export const OUT_OF_STOCK = "Out of stock";
export const INSUFFICIENT_QUANTITY = "Insufficient quantity";
export const COMPLETED = "completed";
export const INSUFFICIENT_AMOUNT = "Insufficient amount";
export const EXCESS_AMOUNT = "Excess amount";
export const AMOUNT_REQ = "Amount is required";
export const AMOUNT_NOT_EMPTY = "Amount cannot be empty";
export const AMOUNT_POSITIVE = "Amount must be greater than 0";
export const ORDER_AND_PAYMENT_COMPLETED = "Order and Payment completed";
