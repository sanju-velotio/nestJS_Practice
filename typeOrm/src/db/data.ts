import { DataSource } from "typeorm";
import { User } from "../entities/User";
export const AppDataSource= new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,  // default port of postgress sql
    username: "postgres",
    password: "jain",
    database: "postgres",
    entities:[User],
    synchronize: true,
    logging: true,
    subscribers: [],
    migrations: [],
})