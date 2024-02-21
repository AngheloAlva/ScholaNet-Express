import 'dotenv/config'
import { get } from 'env-var'

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  CLIENT_URL: get('CLIENT_URL').required().asString(),

  TOKEN_SECRET: get('TOKEN_SECRET').required().asString(),
  REFRESH_TOKEN_SECRET: get('REFRESH_TOKEN_SECRET').required().asString(),

  SENDGRID_API_KEY: get('SENDGRID_API_KEY').required().asString(),

  DATABASE_URL: get('DATABASE_URL').required().asString()
}
