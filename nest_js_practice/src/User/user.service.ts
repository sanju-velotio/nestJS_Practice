
import { Injectable } from "@nestjs/common"

import { AppDataSource } from "src/db/postgress.config"
import { User1Entity } from "src/db/Entities/user.entity"

const UserEntityInstance = new User1Entity()
const Users = AppDataSource.getRepository(User1Entity)
@Injectable()
export class UserService {
    async getAllUsers() {
        return await Users.find()
    }

    async getUserViaEmail(email:string,password:string){
        if(!email || !password){
            return "something missing"
        }
        const findUser= await Users.findOneBy({email:email,password:password})
        if(!findUser){
            return "does not exist"
        }
        return findUser
    }
    async addNewUser(name: string, lname: string, age: number, email: string,password:string) {
        console.log({ name, lname, age, email })
        if (!name || !lname || !age || !email || !password) {
            return "something missing"
        }
        //check is already exits or not
        const isAlreadyExist=await Users.findOneBy({email:email})
        if(!isAlreadyExist){
            UserEntityInstance.name = name
            UserEntityInstance.lname = lname
            UserEntityInstance.age = +age
            UserEntityInstance.email = email
            UserEntityInstance.password=password
            const result = await Users.save(UserEntityInstance)
            return `${result.id}`
        }
        return "user already exists with this email"
    }

   async updateUser(email:string, id:string) {
        console.log({email,id})
        if(!email || !id){
            return "something missing"
        }
        const checkUserExistWithId= await Users.findOneBy({id:+id})
        if(!checkUserExistWithId){
            return "user not exists with this id"
        }
        checkUserExistWithId.email= email
        await Users.save(checkUserExistWithId)
        return "email successfull update"
    }

    async deleteUser(id:string) {
        const findUser= await Users.findOneBy({id:+id})
        if(!findUser){
            return "user is not exists with this id"
        }
        const result= await Users.delete(findUser)
        console.log({result})
        return "user is successfull delete"
    }
}