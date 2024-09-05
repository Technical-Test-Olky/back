require("dotenv").config();
import amqp from "amqplib";

export const QUEUE = "image_processing";

const RABBITMQ_CONNECTION_STRING = `amqp://${process.env.RABBITMQ_ADMIN_USER}:${process.env.RABBITMQ_ADMIN_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;

export const getConnectionData = async () => {
  const connection = await amqp.connect(RABBITMQ_CONNECTION_STRING);
  const channel = await connection.createConfirmChannel();
  await channel.assertQueue(QUEUE, { durable: true });
  return { connection, channel };
};

export const disconnect = async (
  connection: amqp.Connection,
  channel: amqp.ConfirmChannel
) => {
  await channel.waitForConfirms();
  await channel.close();
  await connection.close();
};

export const publishMessage = (
  channel: amqp.ConfirmChannel,
  message: string
) => {
  channel.sendToQueue(QUEUE, Buffer.from(message), { persistent: true });
};

export const bindConsumer = async (
  channel: amqp.ConfirmChannel,
  consumer: (message: amqp.ConsumeMessage | null) => void
) => {
  await channel.consume(QUEUE, consumer, { noAck: true });
};
