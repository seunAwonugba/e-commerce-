import "dotenv/config";
import express from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { connectDb } from "./config/mongoose";
import { host, port } from "./config/env";
import { errorMiddleware } from "./middlewares/error";
import payment from "./router/payment";

const app = express();
app.set("trust proxy", 1);

app.use((req, res, next) => {
    res.removeHeader("Server");
    res.removeHeader("X-Powered-By");
    next();
});
app.use(express.text({ type: "application/xml" }));
app.use((req, res, next) => {
    res.setHeader("Server", "secure-server");
    next();
});

app.use("/api/v1/payment", payment);

app.use("*", (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `Payment service ${ReasonPhrases.NOT_FOUND.toLowerCase()}`,
    });
});

app.use(errorMiddleware);

const startServer = async () => {
    try {
        await connectDb();
        app.listen(port, host, () => {
            console.log(
                `⚡️[payment-service]: Server is running at http://${host}:${port}`,
            );
        });
    } catch (error) {
        console.log("😥 [payment-service]", error);
        process.exit(1);
    }
};

startServer();
