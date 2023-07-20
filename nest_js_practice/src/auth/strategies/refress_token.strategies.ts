import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express"

@Injectable()
export class RefreshTokenStratgy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "refresh-token_secret",
            passReqToCallback: true
        })
    }
    async validate(req: Request, payload: any) {
        console.log("refresh strategy payload",payload)
        const refreshToken = req.get("authorization").replace("Bearer", "").trim()
        return {
            ...payload,
            refreshToken,
        }
    }
}