import { PrismaClient, User } from '@prisma/client'
import { ResultCode, Result, makeResult } from '../others/utils.js'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library'

export const prisma = new PrismaClient()


export async function prismaSafeCall<T>(callback: () => Promise<Result<T>>): Promise<Result<T>> {
    try {
        return await callback()
    } catch (error) {
        //@ts-ignore
        console.log("prisma error", error.name,error.message)
        const result = makeResult<T>()
        result.error = error
        if (error instanceof PrismaClientValidationError) {
            result.error = error
            result.code = ResultCode.INVALID_INPUT
            result.message = ResultCode[ResultCode.INVALID_INPUT]
        }
        else if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                result.error = error
                result.code = ResultCode.DATABASE_ITEM_ALREADY_EXISTS
                result.message = error.message
            }
            else{
                result.error = error
                result.code = ResultCode.DATABASE_ERROR
                result.message = ResultCode[ResultCode.DATABASE_ERROR]
            }
        }
        else {
            result.error = error
            result.code = ResultCode.UNKNOWN_ERROR
            result.message = ResultCode[ResultCode.UNKNOWN_ERROR]
        }

        return result
    }
}


