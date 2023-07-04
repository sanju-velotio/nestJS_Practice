import { Column, PrimaryGeneratedColumn, Entity } from "typeorm"


@Entity()
export class User1Entity {

    @PrimaryGeneratedColumn()
    id: number

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