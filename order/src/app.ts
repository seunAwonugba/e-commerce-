import "dotenv/config";
import express from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { connectDb } from "./config/mongoose";
import { host, port } from "./config/env";
import { errorMiddleware } from "./middlewares/error";
import order from "./router/order";

const app = express();
app.set("trust proxy", 1);

app.use(express.json());

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

app.use("/api/v1/order", order);

app.use("*", (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `Order service ${ReasonPhrases.NOT_FOUND.toLowerCase()}`,
    });
});

app.use(errorMiddleware);

const startServer = async () => {
    try {
        await connectDb();
        app.listen(port, host, () => {
            console.log(
                `⚡️[order-service]: Server is running at http://${host}:${port}`,
            );
        });
    } catch (error) {
        console.log("😥 [order-service]", error);
        process.exit(1);
    }
};

startServer();
