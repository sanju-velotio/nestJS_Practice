
import { BadRequestException, Injectable, NotFoundException, ConflictException, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm";
import { v4 as uuid } from "uuid"
import { AppDataSource } from "../db/postgress.config"
import { User1Entity } from "../db/Entities/user.entity"
import { Repository } from "typeorm";
const Users = AppDataSource.getRepository(User1Entity)

@Injectable()
export class UserService {

    // TODO: inject Repository as dependancy and write test case
    // constructor(
    //     @InjectRepository(User1Entity)
    //     private readUsers: Repository<User1Entity>
    //     ){}

    async getAllUsers() {
        const withoutCredentials = await Users
            .createQueryBuilder("user")
            .select(['user.id', 'user.name', 'user.lname', 'user.age'])
            .getMany()
        return withoutCredentials
    }

    async getUserById(id: string) {
        const user = await Users.findOneBy({ id })
        if (!user) {
            throw new NotFoundException("user not found with this id")
        }
        return user
    }

    async getUserViaEmail(email: string, password: string) {
        if (!email || !password) {
            throw new BadRequestException("something missing.")
        }
        const findUser = await Users.findOneBy({ email: email })
        if (!findUser) {
            throw new NotFoundException("user not found")
        }
        if (findUser.password !== password) {
            throw new UnauthorizedException("invalid credentials")
        }
        else {
            return findUser
        }
    }

    async addNewUser(name: string, lname: string, age: number, email: string, password: string) {
        const UserEntityInstance = new User1Entity()
        console.log({ name, lname, age, email })
        if (!name || !lname || !age || !email || !password) {
            throw new BadRequestException("missing something")
        }

        const isAlreadyExist = await Users.findOneBy({ email: email })
        if (!isAlreadyExist) {
            UserEntityInstance.id = uuid()
            UserEntityInstance.name = name
            UserEntityInstance.lname = lname
            UserEntityInstance.age = +age
            UserEntityInstance.email = email
            UserEntityInstance.password = password
            const result = await Users.save(UserEntityInstance)
            return result
        }
        throw new ConflictException("user already exist with this email")
    }

    async updateUser(email: string, id: string) {
        if (!email || !id) {
            throw new BadRequestException("something missing")
        }
        const checkUserExistWithId = await Users.findOneBy({ id: id })
        if (!checkUserExistWithId) {
            throw new NotFoundException("user not exist with this Id")
        }
        else if (checkUserExistWithId.email === email) {
            throw new BadRequestException("email is updated")
        }
        else {
            checkUserExistWithId.email = email
            const result = await Users.save(checkUserExistWithId)
            return result
        }
    }

    async deleteUser(id: string) {
        if (!id) {
            throw new BadRequestException("id is missing")
        }
        const findUser = await Users.findOneBy({ id: id })
        if (!findUser) {
            throw new NotFoundException("user not exist with this id")
        }
        const result = await Users.delete(findUser)
        console.log("delee user",result)
        return result.affected
    }

    async getUserbyAge(age: number) {
        if (!age) {
            throw new BadRequestException("age number is missing")
        }
        const result = await Users.findOneBy({ age: age })
        if (!result) {
            throw new NotFoundException("user not found with this age")
        }
        return result
    }
}
