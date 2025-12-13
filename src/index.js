// src/index.js
/*
const app = require("./app"); // import express app
const config = require("./config");
const { connectDB, gracefulShutdown } = require("./config/mongoose");

const start = async () => {
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });

  gracefulShutdown(server);
};

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});

*/

// src/index.js
/*
const app = require("./app"); 
const config = require("./config");
const { connectDB, gracefulShutdown } = require("./config/mongoose");
const { connectRedis } = require("./cache/redisClient");

const start = async () => {
  await connectDB();
//redis
  try {
    await connectRedis();
    console.log("Redis connected successfully");
  } catch (err) {
    console.warn("Redis connection failed at startup:", err.message);
  }

  //Start server
  const server = app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });

  //Graceful shutdown
  gracefulShutdown(server);
};

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
*/

const app = require("./app");
const config = require("./config");
const { connectDB, gracefulShutdown } = require("./config/mongoose");
const { connectRedis } = require("./cache/redisClient");

const start = async () => {
  await connectDB();
  await connectRedis(); 

  const server = app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });

  gracefulShutdown(server);
};

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});


