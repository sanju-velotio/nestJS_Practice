import { DataSource } from "typeorm"
import { User1Entity } from "./Entities/user.entity"
import { RegisterEntity } from "./Entities/register.entity"
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "jain",
    database: "postgres",
    synchronize: true,
    logging: true,
    entities: [User1Entity,RegisterEntity],
    subscribers: [],
    migrations: [],
    uuidExtension: "pgcrypto"
})
