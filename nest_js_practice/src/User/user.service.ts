
import { Injectable, NotFoundException } from "@nestjs/common"
import { v4 as uuid } from "uuid"
import { AppDataSource } from "../db/postgress.config"
import { User1Entity } from "../db/Entities/user.entity"
import { ReturnType } from "./Types/user.service.types"
const Users = AppDataSource.getRepository(User1Entity) // TODO


@Injectable()
export class UserService {
    async getAllUsers() {
        const withoutCredentials = await Users
            .createQueryBuilder("user")
            .select(['user.id', 'user.name', 'user.lname', 'user.age'])
            .getMany()
        return withoutCredentials
    }

    async getUserById(id: string) {
        const user = await Users.findOneBy({ id: id })
        if (!user) {
            throw new NotFoundException()
        }
        return user
    }

    async getUserViaEmail(email: string, password: string): ReturnType {
        if (!email || !password) {
            return { statusCode: 400, message: "something missing" }
        }
        const findUser = await Users.findOneBy({ email: email })
        if (!findUser) {
            return { statusCode: 404, message: "user does not exist" }
        }
        if (findUser.password !== password) {
            return { statusCode: 401, message: "invalid credentials" }
        }
        return { statusCode: 200, message: findUser }
    }

    async addNewUser(name: string, lname: string, age: number, email: string, password: string): ReturnType {
        const UserEntityInstance = new User1Entity()
        console.log({ name, lname, age, email })
        if (!name || !lname || !age || !email || !password) {
            return { statusCode: 400, message: "something missing" }
        }
        //check is already exits or not
        const isAlreadyExist = await Users.findOneBy({ email: email })
        if (!isAlreadyExist) {
            UserEntityInstance.id = uuid()
            UserEntityInstance.name = name
            UserEntityInstance.lname = lname
            UserEntityInstance.age = +age
            UserEntityInstance.email = email
            UserEntityInstance.password = password
            const result = await Users.save(UserEntityInstance)
            return { statusCode: 201, message: result.id }
        }
        return { statusCode: 409, message: "user already exists with this email" }
    }

    async updateUser(email: string, id: string): ReturnType {
        console.log({ email, id })
        if (!email || !id) {
            return { statusCode: 400, message: "something missing" }
        }
        const checkUserExistWithId = await Users.findOneBy({ id: id })
        if (!checkUserExistWithId) {
            return { statusCode: 404, message: "user not exists with this id" }
        }
        checkUserExistWithId.email = email
        await Users.save(checkUserExistWithId)
        return { statusCode: 200, message: "email successfull update" }
    }

    async deleteUser(id: string): ReturnType {
        const findUser = await Users.findOneBy({ id: id })
        if (!findUser) {
            return { statusCode: 404, message: "user is not exists with this id" }
        }
        const result = await Users.delete(findUser)
        console.log({ result })
        return { statusCode: 200, message: "user is successfull delete" }
    }
}