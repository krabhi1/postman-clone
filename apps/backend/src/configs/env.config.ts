import 'dotenv/config'
import path from 'path'
import { findFalsyKeys } from "../others/utils.js";


export const env = {
    DATABASE_URL: process.env.DATABASE_URL!!,
    LIVEBLOCK_SECRET: process.env.LIVEBLOCK_SECRET!!,
    PORT: parseInt(process.env.PORT || '3000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!!,
    GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL!!,
    //jwt
    JWT_USER_SECRET: process.env.JWT_USER_SECRET!!,
    JWT_USER_EXPIRES_IN: process.env.JWT_USER_EXPIRES_IN || '3h',

}
const keys = findFalsyKeys(env, ['null', 'undefined', ''])
if (keys.length > 0) {
    throw new Error('Missing environment variables ' + keys.join(', '))
}
