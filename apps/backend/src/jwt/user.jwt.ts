import { env } from "../configs/env.config.js"
import { JWTObjectData, decodeEvenExpired, generateJWT, verifyJWT } from "../others/jwt.utils.js"

export type UserJwtData = {
    userId: string
} 

export function generateUserSignInToken(data: UserJwtData) {
    return generateJWT(data, env.JWT_USER_SECRET, env.JWT_USER_EXPIRES_IN)
}

export function refreshUserSignInToken(oldToken: string) {
    return decodeEvenExpired<UserJwtData>(oldToken, env.JWT_USER_SECRET)
}

export function verifyUserSignInToken(token: string) {
    return verifyJWT<UserJwtData>(token, env.JWT_USER_SECRET)
}