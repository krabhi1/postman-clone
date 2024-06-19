import { RoomPermission } from "../configs/liveblocks.config.js"
import { PartialWithMustAndOmit, PartialWithOmit } from "../others/utils.js"

type SharedUser = {
    userId: string
    permission: RoomPermission | string
}

export type Workspace = {
    id: string
    name: string
    createdAt: Date
    description: string
    roomId: string
    userId: string
    isDeleted: boolean
    sharedUsers: SharedUser[]
}

export type CreateWorkspace = PartialWithMustAndOmit<Workspace, "name" | "description" | "roomId" | "userId", "isDeleted" | "id" | "createdAt">
export type GetWorkspace = Omit<Workspace, "isDeleted">
export type UpdateWorkspace = PartialWithOmit<Workspace, "isDeleted" | "id" | "createdAt" | "userId" | "roomId">


export type WorkspaceGroup = {
    self: GetWorkspace[]
    shared: GetWorkspace[]
}