
import { prisma, prismaSafeCall } from "../configs/prisma.config.js";
import { ResultCode, makeResult, makeResultFrom } from "../others/utils.js";
import { CreateUser, QueryUser, UpdateUser, User } from "../types/user.types.js";


export async function createUser(user: CreateUser) {

    return prismaSafeCall(async () => {
        const result = makeResult<User>()
        const pResult = await prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                createdAt: new Date(),
                picUrl: user.picUrl,
                googleRefreshToken: user.googleRefreshToken
            }
        })
        result.data = {
            createdAt: pResult.createdAt,
            email: pResult.email,
            googleRefreshToken: pResult.googleRefreshToken || undefined,
            id: pResult.id,
            isDeleted: pResult.isDeleted,
            name: pResult.name,
            picUrl: pResult.picUrl || undefined
        }
        return result
    })
}


//update user name , picUrl
export async function updateUser(user: UpdateUser) {
    return prismaSafeCall(async () => {
        const result = makeResult<User>()
        const pResult = await prisma.user.update({
            where: {
                id: user.id,
                email: user.email
            },
            data: {
                name: user.name,
                picUrl: user.picUrl
            }
        })
        result.data = {
            createdAt: pResult.createdAt,
            email: pResult.email,
            googleRefreshToken: pResult.googleRefreshToken || undefined,
            id: pResult.id,
            isDeleted: pResult.isDeleted,
            name: pResult.name,
            picUrl: pResult.picUrl || undefined
        }
        return result
    })

}
//delete new user
//get user by email ,id, all 
export async function getUsers(query?: QueryUser) {
    return prismaSafeCall(async () => {
        let result = makeResult<User[]>()

        if (!query?.id && !query?.email) {
            //return all
            const pResult = await prisma.user.findMany()
            result.data = pResult.map(p => {
                return {
                    createdAt: p.createdAt,
                    email: p.email,
                    googleRefreshToken: p.googleRefreshToken || undefined,
                    id: p.id,
                    isDeleted: p.isDeleted,
                    name: p.name,
                    picUrl: p.picUrl || undefined
                }
            })
            return result
        }
        const pResult = await prisma.user.findUnique({
            where: {
                email: query.email,
                id: query.id
            }
        })
        if (pResult) {
            result.data = [{
                createdAt: pResult.createdAt,
                email: pResult.email,
                googleRefreshToken: pResult.googleRefreshToken || undefined,
                id: pResult.id,
                isDeleted: pResult.isDeleted,
                name: pResult.name,
                picUrl: pResult.picUrl || undefined
            }]
        } else {
            makeResultFrom({
                result,
                code: ResultCode.DATABASE_ITEM_NOT_FOUND
            })

        }
        return result
    })

}
