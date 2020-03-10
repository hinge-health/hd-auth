import { connect, Channel } from 'amqplib';

const connectionProps = {
    protocol: 'amqp',
    hostname: 'rabbitmq',
    port: 5672,
    username: 'guest',
    password: 'guest',
    locale: 'en_US',
    vhost: '/'
}

const queueName = 'test-queue'
let conn;
let channel: Channel;

// const sendMessage = async (channel: Channel): Promise<void> => {
//     const message = uuid();
//     await channel.sendToQueue(queueName, Buffer.from(message));
//     console.log(`send message to queue: ${message}`);
// }

const init = async () => {
    conn = await connect(connectionProps);
    channel = await conn.createChannel();
    await channel.assertQueue(queueName, { durable: false });

}

const sendToQueue = async (data: any): Promise<void> => {
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
}

init();

export default sendToQueue;
