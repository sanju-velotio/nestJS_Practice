import {DataSource} from "typeorm"
import { User1Entity } from "./Entities/user.entity"
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
