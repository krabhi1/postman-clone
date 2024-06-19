import { createRoom, getAllRooms } from "./liveblocks/liveblocks.room.js"
import { identifyUser } from "./liveblocks/liveblocks.user.js"


async function run() {
    // const result=await identifyUser({
    //     groupIds:[],
    //     userId:"123",
    //     userInfo:{
    //         name:"Abhishek"
    //     }

    // })
    // const result=await createRoom("room1"+Math.random(),{
    //     adminUserId:"123",
    //     metadata:{
    //         name:"room"
    //     }
    // })
    const result=await getAllRooms()
    console.log(result)
}

run()