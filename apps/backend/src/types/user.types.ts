import { PartialPick, PartialWithMustAndOmit, PartialWithOmit } from "../others/utils.js"


export type User = {
    id: string
    email: string
    name: string
    createdAt: Date
    picUrl?: string
    isDeleted: boolean
    googleRefreshToken?: string
}

export type CreateUser = PartialWithMustAndOmit<User, "email" | "googleRefreshToken" | "name", "isDeleted" | "id"|"createdAt">

export type GetUser = Omit<User, "isDeleted" | "googleRefreshToken">
export type QueryUser = PartialPick<User,'id'|'email'>

export type UpdateUser = PartialWithOmit<User, "isDeleted"  | "createdAt" | "googleRefreshToken" >

const user: UpdateUser = {
}