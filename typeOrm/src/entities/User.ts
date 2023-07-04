import {Entity,PrimaryGeneratedColumn,Column} from "typeorm"


@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name: string

    @Column()
    lname:string

    @Column()
    email:string

    @Column()
    age:number
}