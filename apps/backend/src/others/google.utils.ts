import { env } from "../configs/env.config.js"
import { httpApiCall } from "./apicall.utils.js"


//get tokens from code
export async function getGoogleTokens(code: string) {
    const query = {
        code: code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: env.GOOGLE_REDIRECT_URL,
        grant_type: 'authorization_code'
    }
    const result = await httpApiCall<{
        access_token: string,
        refresh_token?: string,
        expires_in: number,
        token_type: string,
        scope: string,
        id_token: string
    }>({
        method: 'POST',
        path: "https://oauth2.googleapis.com/token",
        query: query
    })
    console.log({ query ,url:env.GOOGLE_REDIRECT_URL,result })

    return result
}
//get new google access token
export async function getNewGoogleAccessToken(refresh_token: string) {
    const result = await httpApiCall<{
        access_token: string,
        expires_in: number,
        token_type: string,
        scope: string

    }>({
        method: 'POST',
        path: "https://oauth2.googleapis.com/token",
        query: {
            refresh_token,
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            // redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: 'refresh_token'
        }
    })
    return result
}
//get profile from token
export async function getUserProfile(accessToken: string) {

    const result = await httpApiCall<{
        sub: string,
        name: string,
        given_name: string,
        family_name: string,
        picture: string,
        email: string,
        email_verified: boolean,
        locale: string,
        hd: string
    }>({
        method: 'GET',
        path: "https://www.googleapis.com/oauth2/v3/userinfo",
        authToken: accessToken
    })

    return result
}
//