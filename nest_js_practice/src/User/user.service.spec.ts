
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { NotFoundException, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { User1Entity } from '../db/Entities/user.entity';
import { v4 as uuid } from "uuid"

const newUser = {
    id: uuid(),
    name: "John",
    lname: "Doe",
    age: 30,
    email: "john.doe@example.com",
    password: "password123"
}

describe('UserService', () => {
    let userService: UserService;
    let userRepository: any

    beforeEach(async () => {
        userRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn()
        }
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, { provide: "Users", useValue: userRepository }]
        }).compile()
        userService = module.get<UserService>(UserService);
    });


    describe("get All users", () => {
        it("should return users if exist", async () => {
            jest.spyOn(userService, "getAllUsers").mockResolvedValue([newUser])
            const result = await userService.getAllUsers()
            expect(result).toEqual([newUser])
        })
    })

    describe('get user by mail', () => {

        it("should throw BadRequestException when email and password is missing", async () => {
            await expect(userService.getUserViaEmail("", "")).rejects.toThrowError(BadRequestException)
        })

        it("should throw NotFoundException when user is not found with email", async () => {
            jest.spyOn(userService, "getUserViaEmail").mockRejectedValue(new NotFoundException("user not found"))
            await expect(userService.getUserViaEmail("abc@gmailc.om", "password")).rejects.toThrowError(NotFoundException)
        })

        it("should throw UnauthorizedException when user password is incorrect", async () => {
            jest.spyOn(userService, "getUserViaEmail").mockRejectedValue(new UnauthorizedException("invalid credentials"))
            await expect(userService.getUserViaEmail(newUser.email, newUser.password + "12")).rejects.toThrowError(UnauthorizedException)
        })

        it("should return user when password and email are correct", async () => {
            jest.spyOn(userService, "getUserViaEmail").mockResolvedValue(newUser)
            const result = await userService.getUserViaEmail(newUser.email, newUser.password)
            console.log({result},"result of user is found")
            expect(result).toEqual(newUser)
        })
    })

    describe("getUserById", () => {
        it("should return user if user exists with the provided id", async () => {
            const id = "sampleId";
            const userMock = { id: id, name: "John", lname: "Doe", age: 25, email: "abc@gmail.com", password: "password" };
            jest.spyOn(userService, "getUserById").mockResolvedValue(userMock);
            const result = await userService.getUserById(id);
            expect(result).toEqual(userMock);
            expect(userService.getUserById).toHaveBeenCalledWith(id);
        });

        it("should throw NotFoundException if user does not exist with the provided id", async () => {
            const id = "nonExistentId";
            jest.spyOn(userService, "getUserById").mockRejectedValue(new NotFoundException("user not found with this id"));

            try {
                await userService.getUserById(id);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toBe("user not found with this id");
                expect(userService.getUserById).toHaveBeenCalledWith(id);
            }
        });
    });

    describe("add new user", () => {
        it("should throw BadRequestException when missing data", async () => {
            const name = "John"
            const lname = "Doe"
            const age = 30
            const email = "john.doe@example.com"
            const password = "password123"
            await expect(userService.addNewUser("", lname, age, email, password)).rejects.toThrowError(BadRequestException)
            await expect(userService.addNewUser(name, "", age, email, password)).rejects.toThrowError(BadRequestException)
            await expect(userService.addNewUser(name, lname, null, email, password)).rejects.toThrowError(BadRequestException)
            await expect(userService.addNewUser(name, lname, age, "", password)).rejects.toThrowError(BadRequestException)
            await expect(userService.addNewUser(name, lname, age, email, "")).rejects.toThrowError(BadRequestException)
        })

        it("should add a new user", async () => {
            const UserEntityInstance = new User1Entity()
            UserEntityInstance.id = newUser.id
            UserEntityInstance.name = newUser.name
            UserEntityInstance.lname = newUser.lname
            UserEntityInstance.age = newUser.age
            UserEntityInstance.email = newUser.email
            UserEntityInstance.password = newUser.password
            jest.spyOn(userService, "addNewUser").mockResolvedValue(newUser)
            const result = await userService.addNewUser(newUser.name, newUser.lname, newUser.age, newUser.email, newUser.password)
            console.log("add new user", result)
            expect(result).toEqual(UserEntityInstance)
        })

    })

    describe('update user', () => {
        it("should throw BadRequestException when missing data", async () => {
            const email = "john.doe@example.com"
            await expect(userService.updateUser("", "")).rejects.toThrowError(BadRequestException)
            await expect(userService.updateUser(email, "")).rejects.toThrowError(BadRequestException)
            await expect(userService.updateUser("", newUser.id)).rejects.toThrowError(BadRequestException)
        })

        it("should throw NotFoundException when id is not match", async () => {
            const id = "a8055729-09e6-41f0-b6f2-630349c6d037" //wrong id which not exist
            const email = "john.doe@example.com"
            jest.spyOn(userService, "updateUser").mockRejectedValue(new NotFoundException("user not exist with this Id"));
            await expect(userService.updateUser(email, id)).rejects.toThrowError(NotFoundException);
        });

        it("should throw BadRequestException when email is already updated", async () => {
            jest.spyOn(userService, "updateUser").mockRejectedValue(new BadRequestException("email is updated"))
            await (expect(userService.updateUser(newUser.email, newUser.id))).rejects.toThrowError(BadRequestException,);
        })

        it("should update the email when user is exist", async () => {
            const toUpdateEmail = "abc@gmail.com";
            const newUserUpdateEmail = { ...newUser, email: toUpdateEmail }
            jest.spyOn(userService, "updateUser").mockResolvedValue(newUserUpdateEmail)
            const result = await userService.updateUser(toUpdateEmail, newUser.id)
            expect(result).toEqual(newUserUpdateEmail)
        })
    })

    describe("delete a user when user is exits", () => {

        it("should throw BadRequestException when id is not provide", async () => {
            await expect(userService.deleteUser("")).rejects.toThrowError(BadRequestException)
        })

        it("should throw NotFoundException when id is not exist", async () => {
            const id = "dummyId" //wrong id which not exist
            jest.spyOn(userService, "deleteUser").mockRejectedValue(new NotFoundException("user not exist with this id"));
            try {
                await userService.deleteUser(id);
            } catch (err) {
                console.log("error when delete", err);
                expect(err).toBeInstanceOf(NotFoundException);
            }
        })

        it("should return user after delete", async () => {
            jest.spyOn(userService, "deleteUser").mockResolvedValue(1)
            const result = await userService.deleteUser(newUser.id);
            console.log({ result });
            expect(result).toBe(1)
        })
    })

})








        // it("should throw ConflictException when user already exists with the same email", async () => {
        //     //TODO:
        //     const name = "John"
        //     const lname = "Doe"
        //     const age = 30
        //     const email = "john.doe@example.com"
        //     const password = "password123"

        //     jest.spyOn(userService, "addNewUser").mockImplementation(() => {
        //         throw new ConflictException("user already exist with this email");
        //     });
        //     const result = await userService.addNewUser(name, lname, age, email, password)
        //     console.log("result", result)
        //     await expect(userService.addNewUser(name, lname, age, email, password)).rejects.toThrowError(
        //     ConflictException,
        //     );
        // })