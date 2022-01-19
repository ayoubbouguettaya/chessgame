const redis = require("async-redis");

const redisClientConfig = process.env.ENV === 'DEV' ? {} : { host: process.env.REDIS_END_POINT, password: process.env.REDIS_PASSWORD, port: process.env.REDIS_PORT }
const client = redis.createClient(redisClientConfig);
client.on("error", function (error) {
  console.error('error in initialisation redis instance')
  console.error(error.message);
});

module.exports = client;