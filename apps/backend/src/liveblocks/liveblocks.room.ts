import { LiveblocksError, PlainLsonObject, RoomData, RoomInfo, RoomUser } from "@liveblocks/node";
import { RoomPermission, UserMeta, liveblocks } from "../configs/liveblocks.config.js";
import { Result, ResultCode, makeResult, randomId } from "../others/utils.js";
import { toPlainLson, LiveList, LiveObject } from "@liveblocks/client";

async function safeLiveCall<T>(fn: () => Promise<Result<T>>) {
    try {
        return await fn()
    } catch (error: any) {
        const result = makeResult<T>()
        if (error instanceof LiveblocksError) {
            const e = JSON.parse(error.message)
            result.message = e.message
            result.error = e
            result.code = error.status
        }
        else {
            result.error = error
            result.code = ResultCode.UNKNOWN_ERROR
        }
        return result
    }

}

//create room
export async function createRoom(roomId: string, config: {
    adminUserId: string,
    metadata?: any,
}) {
    return safeLiveCall(async () => {
        const result = makeResult<RoomInfo>()
        const room = await liveblocks.createRoom(roomId, {
            defaultAccesses: [],
            groupsAccesses: {},
            usersAccesses: {
                [config.adminUserId]: ["room:write"]
            },
            metadata: config.metadata
        })
        result.data = room
        const initData = new LiveObject({
            workspaceState: new LiveObject({
                name: "New Workspace",
                id: randomId(),
                createdAt: new Date().toISOString(),
                collections: new LiveList([]),
                environments: new LiveList([]),
                globalEnvironment: new LiveObject({
                    name: "Global",
                    id: randomId(),
                    variables: new LiveList([]),
                    createdAt: new Date().toISOString()
                })
            })
        })
        const storage = await liveblocks.initializeStorageDocument(roomId, toPlainLson(initData) as PlainLsonObject)
        //create storage for room
        return result
    })

}
//delete room
export async function deleteRoom(roomId: string) {
    return safeLiveCall(async () => {
        const result = makeResult<{ message: string }>()
        const room = await liveblocks.deleteRoom(roomId)
        result.data = { message: "Room deleted" }
        return result
    })
}
//get room by id
export async function getRoomById(roomId: string) {
    return safeLiveCall(async () => {
        const result = makeResult<RoomInfo>()
        const room = await liveblocks.getRoom(roomId)
        result.data = room
        return result
    })
}
//get all rooms
export async function getAllRooms() {
    return safeLiveCall(async () => {
        const result = makeResult<RoomInfo[]>()
        const rooms: RoomInfo[] = []
        //a recursive function to fetch all rooms
        const fetchRooms = async (cursor: string | undefined = undefined) => {
            const { data, nextCursor } = await liveblocks.getRooms({ startingAfter: cursor })
            rooms.push(...data)
            if (nextCursor) {
                await fetchRooms(nextCursor)
            }
        }
        await fetchRooms()
        result.data = rooms
        return result
    })
}
//add user to room
export async function addUserToRoom(roomId: string, userId: string, permissions: RoomPermission[]) {
    return safeLiveCall(async () => {
        const result = makeResult<RoomData>()
        const user = await liveblocks.updateRoom(roomId, {
            usersAccesses: {
                [userId]: permissions as any
            }
        })
        result.data = user
        return result
    })
}
//remove user from room
export async function removeUserFromRoom() { }
//get all users in room
export async function getActiveUsersInRoom(roomId: string) {
    return safeLiveCall(async () => {

        const result = makeResult<RoomUser[]>()
        const { data: users } = await liveblocks.getActiveUsers(roomId)
        result.data = users
        return result
    })
}