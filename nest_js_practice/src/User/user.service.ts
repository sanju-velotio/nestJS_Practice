
import { Injectable } from "@nestjs/common"
import { v4 as uuid } from "uuid"
import { AppDataSource } from "src/db/postgress.config"
import { User1Entity } from "src/db/Entities/user.entity"

const UserEntityInstance = new User1Entity()
const Users = AppDataSource.getRepository(User1Entity)
@Injectable()
export class UserService {
    async getAllUsers() {
        let withoutCredentials = []
        const allUsers = await Users.find()
        allUsers.forEach(item => {
            withoutCredentials.push({
                id: item.id,
                name: item.name,
                lname: item.lname,
                age: item.age
            })
        })
        return withoutCredentials
    }
    async getUserById(id: string) {
        const findUser = await Users.findOneBy({ id: id })
        return findUser ? findUser : "user not exist with this id"
    }
    async getUserViaEmail(email: string, password: string) {
        if (!email || !password) {
            return "something missing"
        }
        const findUser = await Users.findOneBy({ email: email })
        if (!findUser) {
            return "user does not exist"
        }
        if (findUser.password !== password) {
            return "invalid credentials"
        }
        return findUser
    }
    async addNewUser(name: string, lname: string, age: number, email: string, password: string) {
        console.log({ name, lname, age, email })
        if (!name || !lname || !age || !email || !password) {
            return "something missing"
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
            return `${result.id}`
        }
        return "user already exists with this email"
    }

    async updateUser(email: string, id: string) {
        console.log({ email, id })
        if (!email || !id) {
            return "something missing"
        }
        const checkUserExistWithId = await Users.findOneBy({ id: id })
        if (!checkUserExistWithId) {
            return "user not exists with this id"
        }
        checkUserExistWithId.email = email
        await Users.save(checkUserExistWithId)
        return "email successfull update"
    }

    async deleteUser(id: string) {
        const findUser = await Users.findOneBy({ id: id })
        if (!findUser) {
            return "user is not exists with this id"
        }
        const result = await Users.delete(findUser)
        console.log({ result })
        return "user is successfull delete"
    }
}