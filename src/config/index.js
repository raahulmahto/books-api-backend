const Joi = require('joi');
const dotenv = require('dotenv');

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(4000),
  MONGODB_URI: Joi.string().uri().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_EXP: Joi.string().default('15m'),
  JWT_REFRESH_EXP: Joi.string().default('7d'),
  COOKIE_SECURE: Joi.boolean().default(false), 
  LOG_LEVEL: Joi.string().default('info') ,
})
.unknown()
.required();

const {value: envVars, error} = envSchema.validate(process.env);

if(error){
  throw new Error(`Config validation eoor: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT || 5000,
  mongoUri : envVars.MONGODB_URI || envVars.MONGO_URI,
  jwt: {
    accessSecret: envVars.JWT_ACCESS_SECRET || envVars.JWT_SECRET,
    refresh: envVars.JWT_REFRESH_SECRET || envVars.JWT_SECRET,
    accessExp: envVars.JWT_ACCESS_EXP || '15m',
    RrefreshExp: envVars.JWT_REFRESH_EXP || '7d',
  },
  cookie: {
    secure: envVars.COOKIE_SECURE == 'true' || envVars.COOKIE_SECURE ===true,
    domain: envVars.COOKIE_DOMAIN || undefined,
  },
  
  loglevel: envVars.LOG_LEVEL || 'info',
};