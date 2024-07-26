import { Request } from "express";
import { keyValuesToObject, makeResult } from "../others/utils.js";




/** 
 * -----for request------
 * pmc_headers: string
 * pmc_url: string
 * pmc_others: string //method
 * 
 * -----for response------
 * pmc_error: string
 * pmc_others:string //status statusCode 
 * 
 */


export async function handleFetchRequest(req: Request) {
    const pmc_headers = req.headers['pmc_headers'] as string || ''
    const pmc_url = req.headers['pmc_url'] as string || ''
    const pmc_others = req.headers['pmc_others'] as string || ''

    const headers = keyValuesToObject(pmc_headers)
    const { method } = keyValuesToObject(pmc_others)

    let result = makeResult<any>()

    try {
        const response = await fetch(pmc_url, {
            method: method,
            headers: headers,
        })
    } catch (error) {
        result
    }


    return result;


}