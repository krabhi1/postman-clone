import { httpApiCall } from "../others/apicall.utils.js"

describe('apicall.utils', () => {
    //jsonplacehold
    const url = "https://jsonplaceholder.typicode.com/posts"
    const errorUrl = "https://some.error.url.com"
    //simple
    it('basic', async () => {
        const result = await httpApiCall({ path: url })
        expect(result.code).toBe(200)
    })
    it('basic error', async () => {
        const result = await httpApiCall({ path: errorUrl })
        expect(result.code).toBe(500)
    })
})