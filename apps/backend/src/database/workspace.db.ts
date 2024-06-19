import { prisma, prismaSafeCall } from "../configs/prisma.config.js";
import { ResultCode, makeResult, makeResultFrom } from "../others/utils.js";
import { CreateWorkspace, Workspace } from "../types/workspace.types.js";


export async function createWorkspace(workspace: CreateWorkspace) {
    return prismaSafeCall(async () => {
        const result = makeResult<Workspace>()
        const pResult = await prisma.workspace.create({
            data: {
                name: workspace.name,
                createdAt: new Date(),
                description: workspace.description,
                roomId: workspace.roomId,
                userId: workspace.userId,
                sharedUsers: [],
                isDeleted: false,
            }
        })
        result.data = {
            createdAt: pResult.createdAt,
            description: pResult.description,
            id: pResult.id,
            name: pResult.name,
            roomId: pResult.roomId,
            userId: pResult.userId,
            isDeleted: pResult.isDeleted,
            sharedUsers: pResult.sharedUsers
        }

        return result;
    })
}

//get workspace by id
export async function getWorkspaceById(id: string) {
    return prismaSafeCall(async () => {
        const result = makeResult<Workspace>()
        const pResult = await prisma.workspace.findUnique({
            where: {
                id
            }
        })
        if (!pResult) {
            return result
        }
        result.data = {
            createdAt: pResult.createdAt,
            description: pResult.description,
            id: pResult.id,
            name: pResult.name,
            roomId: pResult.roomId,
            userId: pResult.userId,
            isDeleted: pResult.isDeleted,
            sharedUsers: pResult.sharedUsers,
        }
        return result
    })
}

//get workspace by user id
export async function getWorkspacesByUserId(userId: string) {
    return prismaSafeCall(async () => {
        const result = makeResult<Workspace[]>()
        const pResult = await prisma.workspace.findMany({
            where: {
                userId
            }
        })
        result.data = pResult.map(p => {
            return {
                createdAt: p.createdAt,
                description: p.description,
                id: p.id,
                name: p.name,
                roomId: p.roomId,
                userId: p.userId,
                isDeleted: p.isDeleted,
                sharedUsers: p.sharedUsers,
            }
        })
        return result
    })
}

//get shared workspaces of user

export async function getSharedWorkspacesByUserId(userId: string) {
    return prismaSafeCall(async () => {
        const result = makeResult<Workspace[]>()
        const pResult = await prisma.workspace.findMany({
            where: {
                sharedUsers: {
                    some: {
                        userId
                    },
                }
            }
        })
        result.data = pResult.map(p => {
            return {
                createdAt: p.createdAt,
                description: p.description,
                id: p.id,
                name: p.name,
                roomId: p.roomId,
                userId: p.userId,
                isDeleted: p.isDeleted,
                sharedUsers: p.sharedUsers,
            }
        })
        return result
    })
}

//delete workspace by id
export async function deleteWorkspace(id: string) {
    return prismaSafeCall(async () => {
        const result = makeResult<Workspace>()
        const pResult = await prisma.workspace.delete({
            where: {
                id
            }
        })
        result.data = {
            createdAt: pResult.createdAt,
            description: pResult.description,
            id: pResult.id,
            name: pResult.name,
            roomId: pResult.roomId,
            userId: pResult.userId,
            isDeleted: pResult.isDeleted,
            sharedUsers: pResult.sharedUsers
        }
        return result
    })
}

//add shared user to workspace
export async function addSharedUser(workspaceId: string, userId: string, permission: string) {
    return prismaSafeCall(async () => {
        const result = makeResult<Workspace>()
        const pResult = await prisma.workspace.findUnique({
            where: {
                id: workspaceId,
                AND: {
                    userId: {
                        not: userId
                    }
                }
            },
        })
        if (!pResult) {
            return makeResultFrom({
                result,
                code: ResultCode.DATABASE_ITEM_NOT_FOUND,
                message: "User is admin of this workspace"
            })
        }
        const sharedUsers = pResult.sharedUsers || []
        const existingUser = sharedUsers.find(user => user.userId === userId)
        if (existingUser) {
            return makeResultFrom({
                result,
                code: ResultCode.DATABASE_ITEM_ALREADY_EXISTS,
                message: "User already shared"
            })
        }
        const updatedSharedUsers = [...sharedUsers, { userId, permission }]
        const updatedResult = await prisma.workspace.update({
            where: {
                id: workspaceId,
            },
            data: {
                sharedUsers: {
                    set: updatedSharedUsers
                }
            }
        })
        result.data = {
            createdAt: updatedResult.createdAt,
            description: updatedResult.description,
            id: updatedResult.id,
            name: updatedResult.name,
            roomId: updatedResult.roomId,
            userId: updatedResult.userId,
            isDeleted: updatedResult.isDeleted,
            sharedUsers: updatedResult.sharedUsers
        }
        return result
    })
}


//check workspace not belongs to user
export async function isMyWorkspace(workspaceId: string, userId: string) {
    return prismaSafeCall(async () => {
        const result = makeResult<boolean>()
        const pResult = await prisma.workspace.findUnique({
            where: {
                id: workspaceId
            }
        })
        if (!pResult) {
            return result
        }
        if (pResult.userId === userId) {
            result.data = false
        } else {
            result.data = true
        }
        return result
    })
}
