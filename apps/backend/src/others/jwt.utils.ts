import jwt from "jsonwebtoken";
import { ResultCode, KeyValue, Result, makeResult, makeErrorResult, makeResultFrom } from "./utils.js";

export type JWTObjectData = {
    exp: number
    iat: number
}
/**
 * Generate JWT token
 * @param expiresIn expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d" 
 */
export function generateJWT(
    data: object | JWTObjectData,
    secretKey: string,
    expiresIn: number | string
): string {
    return jwt.sign(data, secretKey, { expiresIn });
}


//verify JWT token
export function verifyJWT<T>(token: string, secretKey: string) {

    const result = makeErrorResult<T>()
    try {
        const decoded = jwt.verify(token, secretKey)
        result.data = decoded as T
    } catch (error) {
        const { name, message } = error as any
        switch (name) {
            case "TokenExpiredError":
                result.code = ResultCode.JWT_EXPIRED_TOKEN
                result.message = message
                break
            case "JsonWebTokenError":
                result.code = ResultCode.JWT_INVALID_ERROR
                result.message = message
                break
            default:
                result.error = error
                result.code = ResultCode.UNKNOWN_ERROR
        }
    }
    return result
}

export function decodeJWT<T>(token: string) {
    return jwt.decode(token) as T | null
}

export function decodeEvenExpired<T>(token: string, secret: string) {
    const vResult = verifyJWT<T>(token, secret)
    const result = makeErrorResult<T>()
    if (vResult.code == ResultCode.JWT_EXPIRED_TOKEN) {
        result.data = decodeJWT<T>(token)!
        result.code = ResultCode.OK
        return result
    }

    if (vResult.data) {
        result.data = vResult.data
        result.code = ResultCode.OK
        return result
    }

    return makeResultFrom({
        other: vResult,
        result
    })
}
