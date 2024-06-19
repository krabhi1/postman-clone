import { nanoid } from 'nanoid'

export type PartialOnly<T, K extends keyof T> = Partial<Pick<T, K>> &
    Omit<T, K>;

export type PartialWithOmit<T, K extends keyof T> = Partial<Omit<T, K>>;
export type PartialWithMust<T, K extends keyof T> = Partial<T> &
    Required<Pick<T, K>>;

//a type that makes A must, B omit, other optional
export type PartialWithMustAndOmit<T, A extends keyof T, B extends keyof T> = Partial<Omit<T, B>> & Required<Pick<T, A>>;

export type OnlyWith<T, K extends keyof T> = Pick<T, K>;
export type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>>

export const isArray = (value: any) => Array.isArray(value);
export const isObject = (value: any) =>
    typeof value === "object" && !isArray(value);
export const isPrimitive = (value: any) =>
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean";




export enum ResultCode {
    OK = 200,
    //http status code
    HTTP_CREATED = 201,
    HTTP_ACCEPTED = 202,
    HTTP_NO_CONTENT = 204,
    HTTP_BAD_REQUEST = 400,
    HTTP_UNAUTHORIZED = 401,
    HTTP_FORBIDDEN = 403,
    HTTP_NOT_FOUND = 404,
    HTTP_CONFLICT = 409,
    HTTP_INTERNAL_SERVER_ERROR = 500,

    //database status code
    DATABASE_ERROR = 1000,
    DATABASE_ITEM_NOT_FOUND = 1001,
    DATABASE_ITEM_ALREADY_EXISTS = 1002,

    //others
    UNKNOWN_ERROR = 0,
    INVALID_INPUT,



    //jwt
    JWT_INVALID_ERROR = 2000,
    JWT_EXPIRED_TOKEN = 2001,

    //Google
    GOOGLE_MISSING_REFRESH_TOKEN = 3000,

}

export type Result<T> = {
    data?: T
    error?: any
    message?: string
    code: ResultCode | number
}

export function makeResult<T>(result: Result<T> = { code: ResultCode.OK }) {
    return result
}
export function makeErrorResult<T>(result: Result<T> = { code: ResultCode.UNKNOWN_ERROR, message: ResultCode[ResultCode.UNKNOWN_ERROR] }) {
    return result
}



export function makeResultFrom<T>(args: {
    code?: ResultCode, result?: Result<T>
    other?: Result<any>
    message?: string
}) {
    const result = args.result || makeResult<T>({ code: ResultCode.UNKNOWN_ERROR })
    if (args.other) {
        result.error = args.other.error
        result.message = args.message || args.other.message
        result.code = args.other.code
        result.data = args.other.data
    }
    else if (args.code) {
        result.code = args.code
        result.message = args.message || ResultCode[args.code]
        
    }
    return result
}





export type KeyValue<T> = Record<string | symbol | number, T>

export type Falsy = "null" | "undefined" | "0" | "" | "false"
export function findFalsyKeys(obj: KeyValue<any>, falsy: Falsy[] = ["null", "undefined"]) {
    return Object.keys(obj).filter(key => {
        const value = obj[key]
        let valueType: string = typeof value
        if (valueType === "object") {
            if (value === null) {
                valueType = "null"
            }
        }
        else if (valueType === "undefined") {
            valueType = "undefined"
        }
        else if (valueType === "string") {
            if (value === "") {
                valueType = ""
            }
        }
        else if (valueType === "boolean") {
            if (value === false) {
                valueType = "false"
            }
        }
        return falsy.includes(valueType as Falsy)
    })
}


export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export function randomId() {
    return nanoid()
}

//check value is null or undefined
export function isNullOrUndefined(value: any) {
    return value === null || value === undefined
}