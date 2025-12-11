// src/index.js

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
