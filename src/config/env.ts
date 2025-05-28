import dotenv from 'dotenv';
dotenv.config({ path: 'src/.env' });

function getEnvVariable(key: string, required = true): string {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value!;
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL,
  PORT: process.env.PORT || '5000',

  MONGO_URI: getEnvVariable('MONGO_URI'),

  JWT_SECRET: getEnvVariable('JWT_SECRET'),
  JWT_EXPIRE: process.env.JWT_EXPIRE || '1d',
};
