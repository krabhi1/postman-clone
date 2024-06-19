
import { Router } from 'express';
import { KeyValue, ResultCode, findFalsyKeys, isNullOrUndefined, makeResult, randomId } from '../others/utils.js';
import { handleCreateWorkspace, handleDeleteWorkspace, handleGetWorkspacesByUser } from '../services/workspace.services.js';

const workspaceRouter: Router = Router();

//create new workspace
workspaceRouter.post('/', async (req, res) => {
    const { name, description } = req.body;
    const fKeys = findFalsyKeys({ name, description })
    if (fKeys.length > 0) {
        return res.status(400).json(
            makeResult({
                code: ResultCode.HTTP_BAD_REQUEST,
                message: `Missing ${fKeys.join(",")}`
            })
        )
    }
    const userId = req.userId;
    const roomId = "Room_" + randomId()
    const result = await handleCreateWorkspace(
        name,
        description,
        roomId,
        userId
    )
    if (!result.data) {
        return res.status(400).json(result)
    }
    res.send(result)

});

//get all workspaces of user
workspaceRouter.get('/', async (req, res) => {
    const {userId} = req.query as KeyValue<string>;
    if (isNullOrUndefined(userId)) { 
        return res.status(400).json(
            makeResult({
                code: ResultCode.HTTP_BAD_REQUEST,
                message: `Missing userId param`
            })
        )
    }
    const result = await handleGetWorkspacesByUser(userId)
    if (isNullOrUndefined(result.data)) {
        return res.status(400).json(result)
    }
    res.send(result)
});

//delete workspace
workspaceRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (isNullOrUndefined(id)) {
        return res.status(400).json(
            makeResult({
                code: ResultCode.HTTP_BAD_REQUEST,
                message: `Missing id param`
            })
        )
    }
    const result=await handleDeleteWorkspace(id)
    if (isNullOrUndefined(result.data)) {
        return res.status(400).json(result)
    }
    res.send(result)
});


export default workspaceRouter;
