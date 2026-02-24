import "dotenv/config";

export const port = Number(process.env.PORT);
export const host = String(process.env.HOST);
export const dbUri = String(process.env.MONGODB_CONNECTION_STRING);
