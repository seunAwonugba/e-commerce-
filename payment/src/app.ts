import "dotenv/config";
import express from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { connectDb } from "./config/mongoose";
import { host, port } from "./config/env";
import { errorMiddleware } from "./middlewares/error";
import payment from "./router/payment";
import { connectRabbitMQ } from "./utils/broker";
import { startTransactionWorker } from "./worker/transaction";
import transaction from "./router/transaction";

const app = express();
app.set("trust proxy", 1);

app.use((req, res, next) => {
    res.removeHeader("Server");
    res.removeHeader("X-Powered-By");
    next();
});
app.use(express.json());
app.use(express.text({ type: "application/xml" }));

app.use((req, res, next) => {
    res.setHeader("Server", "secure-server");
    next();
});

app.use("/api/v1/payment", payment);
app.use("/api/v1/transaction", transaction);

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
        await connectRabbitMQ();
        await startTransactionWorker();
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
