import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

export default {
    uri: process.env.MONGODB_CONNECTION_STRING,
    collection: "migrations",
    migrationsPath: "./migrations",
    // templatePath: "./migrations/template.ts",
    // autosync: false,
};
