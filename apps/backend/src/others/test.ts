import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../configs/prisma.config.js";



async function createWorkspace() {
    try {
        const result = await prisma.workspace.create({
            data: {
                name: "New workspace",
                description: "...nothing",
                createdAt: new Date(),
                roomId: "123",
                userId: "664ddd322744acb07753fab0"
            }
        })
        console.log({ result })
    } catch (e ) {
        if (e instanceof PrismaClientKnownRequestError) {
            console.error(e.message)
        }
    }

}

try {
    createWorkspace()
} catch (error) {
    // console.error(error)
}