import { env } from "./configs/env.config.js";
import { openServer } from "./configs/express.config.js";


openServer();

if(env.NODE_ENV === "development"){
    console.log("development mode");
}