import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterEntity } from "../db/Entities/register.entity"
import { AppDataSource } from 'src/db/postgress.config';
import { registerDto } from './dto/register.dto';
import * as bcrypt from "bcrypt"
import { Tokens } from './types/signup.types';
import { JwtService } from "@nestjs/jwt"
import { v4 as uuid } from "uuid"
import { loginDto } from './dto/login.dto';
const RegisterRepo = AppDataSource.getRepository(RegisterEntity)

@Injectable()
export class AuthService {
    //TODO pass repository inside constructor as dependancy
    constructor(private jwtService: JwtService) { }


    async formatInHash(pass: string) {
        return await bcrypt.hash(pass, 10)
    }

    async getTokens(email: string, userId: string) {
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync({ userId, email }, { secret: "access_token_secret", expiresIn: 60 * 15 }),
            this.jwtService.signAsync({ userId, email }, { secret: "refresh-token_secret", expiresIn: 60 * 60 * 24 * 7 })
        ])
        return { access_token, refresh_token }
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const hashRefreshToken = await this.formatInHash(refreshToken)
        let getUser = await RegisterRepo.findOneBy({ id: userId })
        getUser.updatedAt = `${new Date().toUTCString()}`
        getUser.refreshToken = hashRefreshToken
        await RegisterRepo.save(getUser)
    }

    async register(registerDTO: registerDto): Promise<Tokens> {
        if (!registerDTO.email || !registerDTO.password) {
            throw new BadRequestException("something is missing.")
        }
        const isAlreadyRegister = await RegisterRepo.findOneBy({ email: registerDTO.email })
        if (isAlreadyRegister) {
            throw new ConflictException("user already register with this mail")
        }
        console.log({ time: new Date().toUTCString() })
        const userId = uuid()
        const hashPass = await this.formatInHash(registerDTO.password)
        const tokens = await this.getTokens(registerDTO.email, userId)
        const newUserInstance = new RegisterEntity()
        newUserInstance.id = userId
        newUserInstance.email = registerDTO.email
        newUserInstance.password = hashPass
        newUserInstance.createdAt = `${new Date().toUTCString()}`
        newUserInstance.updatedAt = `${new Date().toUTCString()}`
        newUserInstance.refreshToken = tokens.refresh_token
        const result = await RegisterRepo.save(newUserInstance)
        //update refresh token in hashing format
        await this.updateRefreshToken(result.id, result.refreshToken)
        return tokens
    }

    async login(loginDto: loginDto): Promise<Tokens> {
        const getUser = await RegisterRepo.findOneBy({ email: loginDto.email })
        if (!getUser) {
            throw new ForbiddenException("please signUp first.")
        }
        const isCorrectPassword = await bcrypt.compare(loginDto.password, getUser.password)
        if (!isCorrectPassword) {
            throw new UnauthorizedException("invalid credentials")
        }
        const tokens = await this.getTokens(getUser.email, getUser.id)
        await this.updateRefreshToken(getUser.id, tokens.refresh_token)
        return {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        }
    }

    async logout(id: string) {
        const getUser = await RegisterRepo.findOneBy({ id: id })
        if (!getUser) {
            throw new NotFoundException("user not exist with this id")
        }
        getUser.refreshToken = ""
        await RegisterRepo.save(getUser)
        return "logout success"

    }

    async refreshToken(userId:string, refreshToken:string) {
        const getUser= await RegisterRepo.findOneBy({id:userId})
        if(!getUser) {
            throw new ForbiddenException("Access Denied")
        }
        const isRightRefreshToken= await bcrypt.compare(refreshToken,getUser.refreshToken)
        if(!isRightRefreshToken) {
            throw new UnauthorizedException("Invalid Credentials")
        }
        const tokens= this.getTokens(getUser.email,getUser.id)
        await this.updateRefreshToken(userId,(await tokens).refresh_token)
        return tokens
    }
}
