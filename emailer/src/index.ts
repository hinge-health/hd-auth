import { connect, ConsumeMessage } from 'amqplib';
import nodemailer from 'nodemailer';

const connectionProps = {
    protocol: 'amqp',
    hostname: 'rabbitmq',
    port: 5672,
    username: 'guest',
    password: 'guest',
    locale: 'en_US',
    vhost: '/'
}


const msleep = (n: number) => {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}

function sleep(n: number) {
    msleep(n * 1000);
}

const queueName = 'test-queue'

let transporter;

const handleMessage = async (message: ConsumeMessage): Promise<void> => {
    console.log(`message received: ${message.content.toString()}`)

    const data = JSON.parse(message.content.toString());
    return transporter.sendMail(data);
}

const listen = async () => {
    transporter = nodemailer.createTransport({
        host: 'mailhog',
        port: 1025,
        secure: false
    });

    const conn = await connect(connectionProps);
    const channel = await conn.createChannel();
    const queue = channel.assertQueue(queueName, { durable: false });

    queue.then(() => channel.consume(queueName, handleMessage, { noAck: false }))
    return queue.then(() => {
        console.log('Waiting for messages');
    })

}

sleep(10); // wait for rabbitmq to start
listen();
