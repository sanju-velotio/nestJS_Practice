import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User1Entity } from '../db/Entities/user.entity';
import { AppDataSource } from '../db/postgress.config';

let dummyUsers = [
    { id: "1", name: "John", age: 21, lname: "Doe", email: "John@gmail.com", password: "password" },
    { id: "2", name: "Jane", age: 22, lname: "Smith", email: "Jane@gmail.com", password: "password" },
    { id: "1", name: "Chriss", age: 25, lname: "Hemsworth", email: "chris@gmail.com", password: "password" },
    { id: "1", name: "Dave", age: 27, lname: "Gray", email: "dave@gmail.com", password: "password" },
]


describe('UserService', () => {
    let service: UserService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAllUsers', () => {
        it('should return an array of users without credentials', async () => {
            // Mock the Users repository or database access
            const User =  AppDataSource.getRepository(User1Entity)
            const mockUsers: User1Entity[] = [];
            dummyUsers.forEach(async (item) => {
                const UserEntityInstance = new User1Entity()
                UserEntityInstance.id = item.id
                UserEntityInstance.name = item.name
                UserEntityInstance.lname = item.lname
                UserEntityInstance.age = item.age
                UserEntityInstance.email = item.email
                UserEntityInstance.password = item.password
                const result = await User.save(UserEntityInstance)
                mockUsers.push(result)
            })
            // jest.spyOn(service, 'getAllUsers').mockResolvedValue(mockUsers);
            const result = await service.getAllUsers();
            console.log("result during getAll user", { result })
            expect(result).toEqual(mockUsers);
        });
    });

    // describe('getUserById', () => {
    //     it('should return user if found with the given ID', async () => {
    //         const mockUser = { id: '1', name: 'John', lname: 'Doe', age: 30 };
    //         // jest.spyOn(service, 'getUserById').mockResolvedValue(mockUser);

    //         const result = await service.getUserById('1');

    //         expect(result).toEqual({ statusCode: 200, message: mockUser });
    //     });

    //     it('should return an error message if user is not found with the given ID', async () => {
    //         jest.spyOn(service, 'getUserById').mockResolvedValue(null);

    //         const result = await service.getUserById('999');

    //         expect(result).toEqual({
    //             statusCode: 404,
    //             message: 'user not exist with this id',
    //         });
    //     });
    // });

    // describe('getUserViaEmail', () => {
    //     it('should return user if found with the given email and password', async () => {
    //         const mockUser = { id: '1', name: 'John', lname: 'Doe', age: 30 };
    //         // jest.spyOn(service, 'getUserViaEmail').mockResolvedValue(mockUser);

    //         const result = await service.getUserViaEmail('test@example.com', 'password');

    //         expect(result).toEqual({ statusCode: 200, message: mockUser });
    //     });

    //     it('should return an error message if user is not found with the given email', async () => {
    //         jest.spyOn(service, 'getUserViaEmail').mockResolvedValue(null);

    //         const result = await service.getUserViaEmail('nonexistent@example.com', 'password');

    //         expect(result).toEqual({ statusCode: 404, message: 'user does not exist' });
    //     });

    //     it('should return an error message if the provided password is incorrect', async () => {
    //         jest.spyOn(service, 'getUserViaEmail').mockResolvedValue(null);

    //         const result = await service.getUserViaEmail('test@example.com', 'incorrect');

    //         expect(result).toEqual({ statusCode: 401, message: 'invalid credentials' });
    //     });

    //     it('should return an error message if email or password is missing', async () => {
    //         const result = await service.getUserViaEmail('', '');

    //         expect(result).toEqual({ statusCode: 400, message: 'something missing' });
    //     });
    // });

    // describe('addNewUser', () => {
    //     it('should add a new user and return the user ID', async () => {
    //         const mockUser = { id: '1', name: 'John', lname: 'Doe', age: 30 };
    //         jest.spyOn(service, 'addNewUser').mockResolvedValue({ statusCode: 201, message: '1' });
    //         const result = await service.addNewUser('John', 'Doe', 30, 'test@example.com', 'password');

    //         expect(result).toEqual({ statusCode: 201, userId: '1' });
    //     });

    //     it('should return an error message if any required fields are missing', async () => {
    //         const result = await service.addNewUser('', 'Doe', 30, 'test@example.com', 'password');

    //         expect(result).toEqual({ statusCode: 400, message: 'something missing' });
    //     });

    //     it('should return an error message if the user already exists with the given email', async () => {
    //         jest.spyOn(service, 'addNewUser').mockResolvedValue({ statusCode: 409, message: 'user already exists with this email' });

    //         const result = await service.addNewUser('John', 'Doe', 30, 'existing@example.com', 'password');

    //         expect(result).toEqual({ statusCode: 409, message: 'user already exists with this email' });
    //     });
    // });

    // describe('updateUser', () => {
    //     it('should update the user email and return a success message', async () => {
    //         const result = await service.updateUser('newemail@example.com', '1');

    //         expect(result).toEqual({ statusCode: 200, message: 'email successfully updated' });
    //     });

    //     it('should return an error message if email or ID is missing', async () => {
    //         const result = await service.updateUser('', '');

    //         expect(result).toEqual({ statusCode: 400, message: 'something missing' });
    //     });

    //     it('should return an error message if user is not found with the given ID', async () => {
    //         jest.spyOn(service, 'updateUser').mockResolvedValue({ statusCode: 404, message: 'user not exists with this id' });

    //         const result = await service.updateUser('newemail@example.com', '999');

    //         expect(result).toEqual({ statusCode: 404, message: 'user not exists with this id' });
    //     });
    // });

    // describe('deleteUser', () => {
    //     it('should delete the user and return a success message', async () => {
    //         const result = await service.deleteUser('1');

    //         expect(result).toEqual({ statusCode: 200, message: 'user successfully deleted' });
    //     });

    //     it('should return an error message if user is not found with the given ID', async () => {
    //         jest.spyOn(service, 'deleteUser').mockResolvedValue({ statusCode: 404, message: 'user is not exists with this id' });

    //         const result = await service.deleteUser('999');

    //         expect(result).toEqual({ statusCode: 404, message: 'user is not exists with this id' });
    //     });
    // });
});
