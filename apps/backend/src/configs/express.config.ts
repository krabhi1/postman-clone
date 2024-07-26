import express, { Express } from "express";
import cors from "cors";
import http from "http";
import { env } from "./env.config.js";
import userRouter from "../routes/user.route.js";
import workspaceRouter from "../routes/workspace.route.js";
import { auth } from "../others/routes.utils.js";
import liveblocksRouter from "../routes/liveblocks.route.js";
import sharedUsersRouter from "../routes/sharedUsers.route.js";
import fetchRouter from "../routes/fetch.route.js";
const app: Express = express();

app.use(cors({
   exposedHeaders: ['pmc_headers','pmc_others']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw({type: 'application/octet-stream',limit: '10mb'}))

app.use((res, req, next) => {
    console.log("-------------------")
    console.log('body',res.body)
    console.log('path',res.path)
    console.log('method',res.method)
    console.log('query',res.query)
    console.log('userId',res.userId)
    console.log('params',res.params)
    next();
})

app.get("/", (req, res) => {
    res.send("postman clone server");
});

//routes
app.use("/api/v1/user",userRouter)
app.use("/api/v1/workspace",auth,workspaceRouter)
app.use("/api/v1/workspace",auth,sharedUsersRouter)
app.use("/api/v1/liveblocks",auth,liveblocksRouter)
app.use("/api/v1/fetch",fetchRouter)


app.use((req, res,next) => {
    //print response
    next()
})

let server: http.Server | undefined;

export function closeServer() {
    if (server) {
        server.close();
        server = undefined;
    }
}
export function openServer() {
    server = app.listen(env.PORT, () => {
        console.log(`Server is running on http://localhost:${env.PORT}`);
    });
}
export default app;