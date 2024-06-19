import { JWTObjectData, decodeEvenExpired, decodeJWT, generateJWT, verifyJWT } from "../others/jwt.utils.js"
import { ResultCode, findFalsyKeys, sleep } from "../others/utils.js"


describe('Utils', () => {
    it('findNullOrUndefineKey ', () => {
        const obj = {
            a: 1,
            b: 0,
            c: null,
            d: undefined,
            e: false,
            f: '',
            h: {},
            i: [1, 2, 3]
        }
        const keys = findFalsyKeys(obj)
        expect(keys).toEqual(['c', 'd'])
    })
    it('findNullOrUndefineKey 2 ', () => {
        const obj = {
            a: 1,
            b: 0,
            c: null,
            d: undefined,
            e: false,
            f: '',
            h: {},
            i: [1, 2, 3]
        }
        const keys = findFalsyKeys(obj, ['', 'false'])
        expect(keys).toEqual(['f', 'e'])
    })
})

describe('JWT ', () => {
    const someSecretKey = 'someSecretKey'
    const expiresIn = 60
    const data = { userID: '123' }
    type Data = typeof data & JWTObjectData
    it('basic ', () => {
        const token = generateJWT(data, someSecretKey, expiresIn)
        expect(token).toBeTruthy()
        expect(typeof token).toBe('string')
        expect(token.length).toBeGreaterThan(10)

        //decode
        const result = verifyJWT<Data>(token, someSecretKey)

        expect(result.code).toBe(ResultCode.OK)
        expect(typeof result.data?.exp).toBe('number')

    })


    //expired token
    it('expired token ', async () => {
        const token = generateJWT(data, someSecretKey, 1)
        expect(token).toBeTruthy()
        expect(typeof token).toBe('string')
        expect(token.length).toBeGreaterThan(10)

        await sleep(1000)

        //decode
        const result = verifyJWT<Data>(token, someSecretKey)
        const decoded=decodeJWT<Data>(token)
        expect(result.code).toBe(ResultCode.JWT_EXPIRED_TOKEN)
    })

    //invalid secret
    it('invalid secret ', () => {
        const token = generateJWT(data, someSecretKey, 1)
        expect(token).toBeTruthy()
        expect(typeof token).toBe('string')
        expect(token.length).toBeGreaterThan(10)

        const result = verifyJWT<Data>(token, someSecretKey + 'wrong')
        expect(result.code).toBe(ResultCode.JWT_INVALID_ERROR)
        expect(result.message).toBe('invalid signature')
    })

    it('invalid token ', () => {
        const result = verifyJWT<Data>("invalid-token", someSecretKey)
        expect(result.code).toBe(ResultCode.JWT_INVALID_ERROR)
        expect(result.message).toBe('jwt malformed')

    })

    //decode even expired
    it('decode even expired ', async () => {
        const token = generateJWT(data, someSecretKey, 1)
        expect(token).toBeTruthy()
        expect(typeof token).toBe('string')
        expect(token.length).toBeGreaterThan(10)

        await sleep(1000)

        //decode
        const result=decodeEvenExpired<Data>(token, someSecretKey)
        expect(result.code).toBe(ResultCode.OK)
        expect(result.data).toBeTruthy()
        expect(result.data?.userID).toBe(data.userID)

        //invalid token
        const result2=decodeEvenExpired<Data>("invalid-token", someSecretKey)
        expect(result2.code).toBe(ResultCode.JWT_INVALID_ERROR)
    
    })

})

