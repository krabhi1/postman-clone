import { createRoom, getAllRooms } from "./liveblocks/liveblocks.room.js";
import { identifyUser } from "./liveblocks/liveblocks.user.js";
import { nanoid } from "nanoid";

type User = {
  name: string;
  age: number;
};
async function run() {
  const user1: User = {
    name: "Abhishek",
    age: 21,
  };
  console.log(user1);
  const id = nanoid();
  console.log(id);
  
}

run();
