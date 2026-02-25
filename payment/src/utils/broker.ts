import amqplib, { Channel } from "amqplib";
import { rabbitMqUrl } from "../config/env";
import { IPayment, IPaymentTransaction } from "../interface/payment";

let connection: any;
let channel: any;

/**
 * Establish RabbitMQ connection (singleton)
 */
export const connectRabbitMQ = async () => {
    try {
        if (channel) return channel;

        connection = await amqplib.connect(rabbitMqUrl);

        connection.on("close", () => {
            console.warn("RabbitMQ connection closed");
            channel = null;
            connection = null;
        });

        connection.on("error", (err: any) => {
            console.error("RabbitMQ connection error:", err);
        });

        channel = await connection.createChannel();

        console.log(`⚡️[payment-broker]: Broker connected`);
        return channel;
    } catch (error) {
        console.log("😥 [payment-broker]", error);
        throw error;
    }
};

/**
 * Get active channel
 */
export const getRabbitChannel = (): Channel => {
    if (!channel) {
        throw new Error(
            "RabbitMQ channel not initialized. Call connectRabbitMQ() first.",
        );
    }
    return channel;
};

/**
 * Assert queue helper
 */
export const assertQueue = async (queueName: string) => {
    const ch = getRabbitChannel();
    await ch.assertQueue(queueName, { durable: true });
};

/**
 * Publish message
 */
export const publishMessage = async (
    queueName: string,
    message: IPaymentTransaction,
) => {
    const ch = getRabbitChannel();
    await ch.assertQueue(queueName, { durable: true });

    ch.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        persistent: true,
    });
};

/**
 * Consume messages
 */
export const consumeMessages = async (
    queueName: string,
    handler: (msg: any) => Promise<void>,
) => {
    const ch = getRabbitChannel();
    await ch.assertQueue(queueName, { durable: true });

    ch.consume(queueName, async (msg) => {
        if (!msg) return;

        try {
            const data = JSON.parse(msg.content.toString());
            await handler(data);
            ch.ack(msg);
        } catch (err) {
            console.error("❌ Message processing failed:", err);
            ch.nack(msg, false, false);
        }
    });
};

/**
 * Graceful shutdown
 */
export const closeRabbitMQ = async (): Promise<void> => {
    try {
        if (channel) await channel.close();
        if (connection) await connection.close();
        console.log("RabbitMQ connection closed");
    } catch (error) {
        console.error("Error closing RabbitMQ connection", error);
    }
};
