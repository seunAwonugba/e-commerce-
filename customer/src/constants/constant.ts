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
export const EMAIL_REQUIRED = "Email address is required";
export const VALID_EMAIL = "Valid email required";
export const EMAIL_EXIST = "Email exist";
