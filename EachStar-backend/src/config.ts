import type { Context } from 'koa'
import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
const authConfig = {
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  giteeClientId: process.env.GITEE_CLIENT_ID,
  giteeClientSecret: process.env.GITEE_CLIENT_SECRET,
  githubRedirectPath: process.env.GITHUB_REDIRECT_PATH,
  giteeRedirectPath: process.env.GITEE_REDIRECT_PATH,
  githubCallbackPath: process.env.GITHUB_CALLBACK_PATH,
  giteeCallbackPath: process.env.GITEE_CALLBACK_PATH,
}

const serviceConfig = {
  auth: authConfig,
  databaseUrl: process.env.POSTGRES_DATABASE_URL,
  apiPort: process.env.API_PORT,
}
export default serviceConfig
