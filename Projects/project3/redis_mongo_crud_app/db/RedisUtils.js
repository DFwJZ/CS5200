const { Redis } = require("ioredis");
const redisClient = new Redis({
  host: "localhost", // Redis host
  port: 6379, // Redis port
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const RedisUtils = () => {
  const ru = {};
  // Function to get data from Redis
  ru.getData = (key) => {
    return new Promise((resolve, reject) => {
      redisClient.get(key, (err, data) => {
        if (err) reject(err);
        if (data) resolve(JSON.parse(data));
        else resolve(null);
      });
    });
  };

  // Function to set data in Redis
  ru.setData = (key, data, expiry = 3600) => {
    return new Promise((resolve, reject) => {
      redisClient.setex(key, expiry, JSON.stringify(data), (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
  };

  // Function to delete data from Redis
  ru.deleteData = (key) => {
    return new Promise((resolve, reject) => {
      redisClient.del(key, (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
  };

  return ru;
};

module.exports = RedisUtils();
