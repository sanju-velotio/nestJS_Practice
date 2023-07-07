import { User1Entity } from "src/db/Entities/user.entity";

export type ReturnType =Promise<{
    statusCode: number;
    message: string;
} | {
    statusCode: number;
    message: User1Entity;
}>