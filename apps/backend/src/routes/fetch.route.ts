import { Router } from "express";
import { findFalsyKeys, objToKeyValuesString } from "../others/utils.js";
import parseHeaders from "parse-headers";

const fetchRouter: Router = Router();

//if body if none
//if body is form-data
//if body is raw
//if body is binary

/** 
 * -----for request------
 * pmc_headers: string
 * pmc_url: string
 * pmc_others: string //method
 * 
 * -----for response------
 * pmc_error: string
 * pmc_others:string //status statusCode 
 * pmc_headers: string

 * 
 */
fetchRouter.post("/", async (req, res) => {
    const pmc_headers = req.headers['pmc_headers'] as string || ''
    const pmc_url = req.headers['pmc_url'] as string || ''
    const pmc_others = req.headers['pmc_others'] as string || ''

    const falseKeys = findFalsyKeys({ pmc_url, pmc_others })
    if (falseKeys.length > 0) {
        res.status(400).send(`${falseKeys.join(',')} headers is required`)
        return
    }


    const headers = parseHeaders(pmc_headers) as Record<string, string>
    const { method } = parseHeaders(pmc_others) as Record<string, string>

    try {
        const response = await fetch(pmc_url, {
            method: method,
            headers: headers,
        })
        const blob = await response.blob();
        const contentType = response.headers.get('content-type')
        const pmc_headers = objToKeyValuesString(
            Array.from(response.headers.entries()).reduce((acc: any, [key, value]) => {
                acc[key] = value
                return acc
            }, {} as any)
        )
        res.appendHeader('pmc_headers', pmc_headers)

        //others
        const pmc_others = objToKeyValuesString({
            status: response.status + '',
            statusCode: response.statusText,
            size: blob.size + ''
        })
        res.appendHeader('pmc_others', pmc_others)
        if (contentType) {
            res.appendHeader('content-type', contentType)
        }
        try {
            const text = await blob.text();
            res.send(text)
        } catch (error) {
            const array = await blob.arrayBuffer();
            const buffer = Buffer.from(array)
            res.send(buffer)
        }


    } catch (error: any) {
        console.log('fetch_error', error)
        res.appendHeader('pmc_error', error.message)
        res.send(error)
    }
    res.end()
});

export default fetchRouter;