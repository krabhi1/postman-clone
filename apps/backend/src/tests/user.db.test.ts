import "dotenv/config";
import { prisma } from "../configs/prisma.config.js";
import { createUser, getUsers, updateUser } from "../database/user.db.js";
import { faker } from '@faker-js/faker'
import { CreateUser, UpdateUser } from "../types/user.types.js";
import { ResultCode } from "../others/utils.js";

beforeEach(async () => {
    await prisma.$connect();
});

afterEach(async () => {
    await prisma.$disconnect();
});

describe("db user", () => {
    it("new", async () => {
        const user: CreateUser = {
            email: faker.internet.email(),
            name: faker.person.fullName(),
            picUrl: faker.image.avatar(),
            googleRefreshToken: "1//0gGD1yIUUZoyeCgYIARAAGBASNwF-L9IrgVAa1rzbo6aNSoNjcmulT6r2WmRcGHelX0FP9YBuvA980cdZzVIXQn1OxZ_q7X-nwaU"
        }
        const result = await createUser(user)

        expect(result.data).toBeTruthy()
        expect(result.code).toBe(ResultCode.OK)
        expect(result.data!!.email).toBe(user.email)
        expect(result.data!!.name).toBe(user.name)
        expect(result.data!!.picUrl).toBe(user.picUrl)
        expect(result.data!!.googleRefreshToken).toBe(user.googleRefreshToken)
        expect(result.data?.id).toBeTruthy()

    });
    it("get user by email", async () => {
        const email = "test@gmail.com"
        const result = await getUsers({ email })
        expect(result.data).toBeTruthy()
    })
    it("new with duplicate email", async () => {
        const user: CreateUser = {
            email: "test@gmail.com",
            name: faker.person.firstName(),
            picUrl: faker.image.avatar(),
            googleRefreshToken: "1//0gGD1yIUUZoyeCgYIARAAGBASNwF-L9IrgVAa1rzbo6aNSoNjcmulT6r2WmRcGHelX0FP9YBuvA980cdZzVIXQn1OxZ_q7X-nwaU"
        }
        let result = await getUsers({ email: user.email })
        if(!result.data){
            const cResult = await createUser(user)
            expect(cResult.data).toBeTruthy()
            expect(cResult.code).toBe(ResultCode.OK)
            expect(cResult.data?.email).toBe(user.email)
        }

        let cResult = await createUser(user)
        expect(cResult.data).toBeFalsy()
        expect(cResult.code).toBe(ResultCode.DATABASE_ITEM_ALREADY_EXISTS)

    });
    //update 
    it("update", async () => {
        const user: UpdateUser = {
            email: "test@gmail.com",
            picUrl: faker.image.avatar(),

        }
        const result = await updateUser(user)
        expect(result.data).toBeTruthy()
        expect(result.code).toBe(ResultCode.OK)
        expect(result.data!!.email).toBe(user.email)
        expect(result.data!!.picUrl).toBe(user.picUrl)

    });
    it("update with invalid input", async () => {
        const user: UpdateUser = {
            // email: "test@gmail.com",
            picUrl: faker.image.avatar(),

        }
        const result = await updateUser(user)
        expect(result.data).not.toBeTruthy()
        expect(result.code).toBe(ResultCode.INVALID_INPUT)

    });

    //get all
    it("get all", async () => {
        const result = await getUsers()
        expect(result.data).toBeTruthy()

    });



})