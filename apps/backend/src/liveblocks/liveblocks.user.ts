import { liveblocks } from "../configs/liveblocks.config.js"
import { isHttpOk } from "../others/apicall.utils.js"
import { makeResult } from "../others/utils.js"

export async function identifyUser({ userId, groupIds, userInfo }: {
    userId: string,
    groupIds: string[],
    userInfo: {
        name: string,
        avatar?: string,
        more?: any
    }
}) {
    const result = makeResult<{ token: string }>()
    const { body, status } = await liveblocks.identifyUser({ userId, groupIds }, { userInfo })
    if (isHttpOk(status)) {
        result.data = JSON.parse(body)
    } else {
        const error = JSON.parse(body)
        result.error = error
        result.message = error.message
    }
    result.code = status
    return result
}
