import redis from 'redis';

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
});

redisClient.on('connect', () => {
    console.log(`Connected to ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
});

export default redisClient;
