
import { Router } from 'express';
import { ResultCode, makeErrorResult, makeResult, makeResultFrom } from '../others/utils.js';
import { handleGetUser, handleGoogleSignInFromCode } from '../services/user.services.js';
import { refreshUserSignInToken } from '../jwt/user.jwt.js';
import { auth } from '../others/routes.utils.js';

const userRouter: Router = Router();

userRouter.post('/google/signin', async (req, res) => {
    const { code } = req.body;
    const result = makeErrorResult<{ token: string }>();
    if (!code) {
        const result = makeResult({ code: ResultCode.HTTP_BAD_REQUEST, message: 'Missing code' });
        return res.status(result.code).json(result);
    }
    const tResult = await handleGoogleSignInFromCode(code);
    if (!tResult.data) {
        return res.status(400).json(tResult);
    }
    makeResultFrom({ other: tResult, result })
    res.send(result);
})


userRouter.post('/refresh/access_token', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        const result = makeResult({ code: ResultCode.HTTP_BAD_REQUEST, message: 'Missing token' });
        return res.status(result.code).json(result);
    }
    const tResult = refreshUserSignInToken(token);
    if (!tResult.data) {
        return res.status(400).json(tResult);
    }
    res.send(tResult);
})



//profile
userRouter.get('/profile', auth, async (req, res) => {
    const userId = req.userId;
    const result = await handleGetUser(userId)
    if (!result.data) {
        return res.status(400).json(result)
    }
    res.send(result)
})
export default userRouter;
