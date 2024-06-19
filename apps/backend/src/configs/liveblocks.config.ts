import { Liveblocks } from "@liveblocks/node";
import { env } from "./env.config.js";


export const liveblocks = new Liveblocks({
    secret: env.LIVEBLOCK_SECRET
});

export type RoomPermission = "room:write" | "room:read" | "room:presence:write"
export type UserMeta = {
    id: string;
    info: {
        name: string;
        avatar: string;
    };
};
//create room

//add user to room
//remove user from room
//delete room
//get room by :id or all
//get users in room