import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_SYNC: Joi.boolean().required(),
  DATABASE_AUTOLOAD: Joi.boolean().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
  JWT_REFRESH_TOKEN_TTL: Joi.number().required(),
  MINIO_ENDPOINT: Joi.string().default('localhost'),
  MINIO_PORT: Joi.number().port().default(9000),
  MINIO_ACCESS_KEY: Joi.string().required(),
  MINIO_SECRET_KEY: Joi.string().required(),
  MINIO_USE_SSL: Joi.boolean().default(false),
  MINIO_URL_EXPIRATION_MINUTES: Joi.number().default(15),
  MINIO_MAX_FILE_UPLOAD_IN_GB: Joi.number().default(4),
  MINIO_TEMP_UPLOAD_DIR: Joi.string().required(),
});
