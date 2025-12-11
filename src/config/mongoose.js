const mongoose = require('mongoose');
const config = require('./index');


async function connectDB() {
  try {
    // Minimal options compatible with modern drivers
    const opts = {
      // pool sizing
      minPoolSize: 2,
      maxPoolSize: 10,
      // timeouts
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // retryWrites is OK for modern drivers, but optional
      retryWrites: true,
       w: 'majority' // optional write concern
    };

    await mongoose.connect(config.mongoUri, opts);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err; // rethrow so bootstrap can handle process exit
  }
}

function gracefulShutdown(server) {
  const shutdown = async () => {
    console.log('Shutting down gracefully...');
    try {
      await mongoose.connection.close(false);
      console.log('MongoDB connection closed');
      if (server) {
        server.close(() => {
          console.log('HTTP server closed');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    } catch (err) {
      console.error('Error during shutdown', err);
      process.exit(1);
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

module.exports = { connectDB, gracefulShutdown };