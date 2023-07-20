import { Column, Entity, IsNull, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class RegisterEntity{
    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column()
    email:string

    @Column()
    password:string

    @Column()
    createdAt:string

    @Column()
    updatedAt:string
    
    @Column()
    refreshToken:string
}