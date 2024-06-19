import { Router } from "express";
import { findFalsyKeys, makeResult } from "../others/utils.js";
import { handleAddSharedUserToWorkspace } from "../services/workspace.services.js";


const sharedUsersRouter: Router = Router();

sharedUsersRouter.get("/", (req, res) => {
    res.send("sharedUsersRouter");
});

sharedUsersRouter.post("/:id/sharedUsers", async (req, res) => {
    const id = req.params.id;
    const { email, permission } = req.body;
    const fKeys = findFalsyKeys({ email, permission, id }, ["", 'null', 'undefined']);
    if (fKeys.length > 0) {
        return res.status(400).json(makeResult({
            code: 400,
            message: `Missing ${fKeys.join(",")}`
        }));
    }
    const result = await handleAddSharedUserToWorkspace(id, email, permission);
    
    if (!result.data) {
        return res.status(400).json(result);
    }
    res.send(result);
});


export default sharedUsersRouter;