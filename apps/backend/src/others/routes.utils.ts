
import { Request, Response, NextFunction } from 'express'
import { ResultCode, makeErrorResult } from './utils.js';
import { verifyUserSignInToken } from '../jwt/user.jwt.js';


export function extractTokenFromHeader(request: Request) {
    const [type, token] = request.get('Authorization')?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
}

export function auth(req: Request, res: Response, next: NextFunction) {
    const token = extractTokenFromHeader(req);
    if (!token) {
        return res.status(401).json(makeErrorResult({
            code: ResultCode.HTTP_UNAUTHORIZED,
            message: 'Missing token'
        }))
    }

    const result = verifyUserSignInToken(token)
    if (!result.data) {
        return res.status(401).json(result)
    }
    req.userId = result.data.userId

    next()
}