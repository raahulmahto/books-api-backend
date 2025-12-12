
//const { createClient } = require('redis');
const redis = require('redis');
const config = require('../config');

/*

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const client = createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: attempts => Math.min(attempts * 50, 2000)
  }
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

async function connectRedis() {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    console.log('Connected to Redis:', REDIS_URL);
  } catch (err) {
    console.warn('Could not connect to Redis on startup:', err.message);
  }
}

module.exports = { client, connectRedis }; */

let client;

async function connectRedis() {
  if (client) return client;

  client = redis.createClient({
    url: config.redisUrl,
    socket: {
      tls: false,                  // cloud tier non-tls
    }
  });

  client.on('error', (err) => {
    console.error('Redis error:', err);
  });

  await client.connect();
  console.log('Redis connected');

  return client;
}

module.exports = { connectRedis };

