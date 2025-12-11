const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'books-api-backend' },
  transports: [
    new transports.Console({ handleExceptions: true })
  ],
  exitOnError: false,
});

module.exports = logger;
