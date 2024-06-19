import { addSharedUser, createWorkspace, deleteWorkspace, getSharedWorkspacesByUserId, getWorkspacesByUserId } from "../database/workspace.db.js";
import { addUserToRoom, createRoom, deleteRoom } from "../liveblocks/liveblocks.room.js";
import { ResultCode, makeResult, makeResultFrom } from "../others/utils.js";
import { GetWorkspace, Workspace, WorkspaceGroup } from "../types/workspace.types.js";
import { getUsers } from "../database/user.db.js";
import { RoomPermission } from "../configs/liveblocks.config.js";


export async function handleCreateWorkspace(
    name: string,
    description: string,
    roomId: string,
    userId: string
) {
    const result = makeResult<GetWorkspace>()
    //create liveblocks room
    const roomResult = await createRoom(roomId, {
        adminUserId: userId
    })
    if (!roomResult.data) {
        return makeResultFrom({
            other: roomResult,
            result
        })
    }
    //create db workspace
    const dbResult = await createWorkspace({
        name,
        description,
        roomId,
        userId
    })
    if (!dbResult.data) {
        return makeResultFrom({
            other: dbResult,
            result
        })
    }
    result.data = {
        createdAt: dbResult.data.createdAt,
        description: dbResult.data.description,
        id: dbResult.data.id,
        name: dbResult.data.name,
        roomId: dbResult.data.roomId,
        userId: dbResult.data.userId,
        sharedUsers: dbResult.data.sharedUsers
    }

    return result

}

//get all workspaces of user
export async function handleGetWorkspacesByUser(userId: string) {
    const result = makeResult<WorkspaceGroup>()
    const dbResult = await getWorkspacesByUserId(userId)
    if (!dbResult.data) {
        return makeResultFrom({
            other: dbResult,
            result
        })
    }
    const self = dbResult.data.map((d) => {
        return {
            createdAt: d.createdAt,
            description: d.description,
            id: d.id,
            name: d.name,
            roomId: d.roomId,
            userId: d.userId,
            sharedUsers: d.sharedUsers
        }
    })

    const sharedResult = await getSharedWorkspacesByUserId(userId)
    if (!sharedResult.data) {
        return makeResultFrom({
            other: sharedResult,
            result
        })
    }
    const shared = sharedResult.data.map((d) => {
        return {
            createdAt: d.createdAt,
            description: d.description,
            id: d.id,
            name: d.name,
            roomId: d.roomId,
            userId: d.userId,
            sharedUsers: d.sharedUsers
        }
    })
    result.data = {
        self,
        shared
    }
    return result;
}

//delete workspace
export async function handleDeleteWorkspace(workspaceId: string) {
    const result = makeResult<{ message: string }>()
    //delete workspace
    const dbResult = await deleteWorkspace(workspaceId)
    if (!dbResult.data) {
        return makeResultFrom({
            other: dbResult,
            result
        })
    }
    //delete liveblocks room
    const roomResult = await deleteRoom(dbResult.data.roomId)
    if (!roomResult.data) {
        return makeResultFrom({
            other: roomResult,
            result
        })
    }
    result.data = { message: "Workspace deleted" }
    return result;
}

//handle add shared user to workspace
export async function handleAddSharedUserToWorkspace(workspaceId: string, email: string, permission: RoomPermission) {
    const result = makeResult<Workspace>()
    //check if user exist in db
    const findUserResult = await getUsers({ email })
    if (!findUserResult.data || findUserResult.data.length == 0) {
        return makeResultFrom({
            other: findUserResult,
            result,
            message: findUserResult.code == ResultCode.DATABASE_ITEM_NOT_FOUND ? "User not found with email = " + email : undefined
        })
    }
    //check if user is not admin of workspace
    //add user to workspace if not already added
    const dbResult = await addSharedUser(workspaceId, findUserResult.data[0].id, permission)

    //return workspace
    if (!dbResult.data) {
        return makeResultFrom({
            other: dbResult,
            result
        })
    }
    //update room with new user
    const roomResult = await addUserToRoom(dbResult.data.roomId, findUserResult.data[0].id, [permission])
    if (!roomResult.data) {
        //TODO undo db changes

        return makeResultFrom({
            other: roomResult,
            result
        })
    }
    result.data = dbResult.data
    return result

}