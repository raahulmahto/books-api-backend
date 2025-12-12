const Joi = require('joi');
const dotenv = require('dotenv');

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(4000),

  // MongoDB
  MONGODB_URI: Joi.string().uri().required(),

  // JWT
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_EXP: Joi.string().default('15m'),
  JWT_REFRESH_EXP: Joi.string().default('7d'),

  // Cookies
  COOKIE_SECURE: Joi.boolean().default(false),
  COOKIE_DOMAIN: Joi.string().allow('', null),

  // Logging
  LOG_LEVEL: Joi.string().default('info'),

  // Redis Cloud
  REDIS_URL: Joi.string().uri().required(),
})
  .unknown()
  .required();

const { value: envVars, error } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT || 5000,

  // Mongo
  mongoUri: envVars.MONGODB_URI,

  // JWT
  jwt: {
    accessSecret: envVars.JWT_ACCESS_SECRET,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    accessExp: envVars.JWT_ACCESS_EXP,
    refreshExp: envVars.JWT_REFRESH_EXP,
  },

  // Cookies
  cookie: {
    secure: envVars.COOKIE_SECURE === true || envVars.COOKIE_SECURE === 'true',
    domain: envVars.COOKIE_DOMAIN || undefined,
  },

  // Logging
  loglevel: envVars.LOG_LEVEL,

  // Redis
  redisUrl: envVars.REDIS_URL,
};
