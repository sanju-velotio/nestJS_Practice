import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User1Entity } from '../db/Entities/user.entity';
import { DataSource } from 'typeorm';
// import { AppDataSource } from '../db/postgress.config';
export const AppDataSource= new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "sanju@123",
    database: "postgres",
    synchronize: true,
    logging: true,
    entities: [User1Entity],
    subscribers: [],
    migrations: [],
    uuidExtension:"pgcrypto"
})


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

});
