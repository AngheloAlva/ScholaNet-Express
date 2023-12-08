import 'dotenv/config'
import { get } from 'env-var'

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  MONGO_URL: get('MONGO_URL').required().asString(),
  MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
  TOKEN_SECRET: get('TOKEN_SECRET').required().asString(),
  SENDGRID_API_KEY: get('SENDGRID_API_KEY').required().asString(),
  CLIENT_URL: get('CLIENT_URL').required().asString()
}
