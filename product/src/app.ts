import "dotenv/config";
import express from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { connectDb } from "./config/mongoose";
import { host, port } from "./config/env";
import { errorMiddleware } from "./middlewares/error";
import { corsOptions } from "./constants/constant";
import cors from "cors";
import product from "./router/product";

const app = express();
app.set("trust proxy", 1);

app.use(express.json());
if (process.env.NODE_ENV == "development") {
    app.use(cors());
} else {
    app.use(cors(corsOptions));
}

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

app.use("/api/v1/product", product);

app.use("*", (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `Product service ${ReasonPhrases.NOT_FOUND.toLowerCase()}`,
    });
});

app.use(errorMiddleware);

const startServer = async () => {
    try {
        await connectDb();
        app.listen(port, host, () => {
            console.log(
                `⚡️[product-service]: Server is running at http://${host}:${port}`,
            );
        });
    } catch (error) {
        console.log("😥 [product-service]", error);
        process.exit(1);
    }
};

startServer();
