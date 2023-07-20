import { Column, PrimaryGeneratedColumn, Entity } from "typeorm"
import { v4 as UUID } from "uuid"

@Entity()
export class User1Entity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    lname: string

    @Column()
    age: number

    @Column()
    email: string

    @Column()
    password: string
}