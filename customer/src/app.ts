import "dotenv/config";
import express from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { connectDb } from "./config/mongoose";
import { host, port } from "./config/env";
import { errorMiddleware } from "./middlewares/error";
import yamljs from "yamljs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { corsOptions } from "./constants/constant";
import cors from "cors";

const app = express();
app.set("trust proxy", 1);

const docs = yamljs.load(path.join(__dirname, "../src/docs.yaml"));
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

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(docs));
app.get("/api/v1/docs-json", (req, res) => {
    res.json(docs);
});

app.use("*", (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `Customer service ${ReasonPhrases.NOT_FOUND.toLowerCase()}`,
    });
});

app.use(errorMiddleware);

const startServer = async () => {
    try {
        await connectDb();
        app.listen(port, host, () => {
            console.log(
                `⚡️[customer-service]: Server is running at http://${host}:${port}`,
            );
        });
    } catch (error) {
        console.log("😥 [customer-service]", error);
        process.exit(1);
    }
};

startServer();
