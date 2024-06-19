import { Router } from "express";
import { ResultCode, findFalsyKeys, makeResult } from "../others/utils.js";
import { identifyUser } from "../liveblocks/liveblocks.user.js";

const liveblocksRouter: Router = Router();


liveblocksRouter.post("/auth", async (req, res) => {
    const userId = req.userId;
    const { roomId, userInfo } = req.body;
    const fKeys = findFalsyKeys({ roomId, userInfo })
    if (fKeys.length > 0) {
        return res.status(400).json(
            makeResult({
                code: ResultCode.HTTP_BAD_REQUEST,
                message: `Missing ${fKeys.join(",")}`
            })
        )
    }
    const iResult = await identifyUser({
        userId, groupIds: [], userInfo
    })
    if (!iResult.data) {
        return res.status(400).json(iResult)
    }
    res.send(iResult)
});


export default liveblocksRouter